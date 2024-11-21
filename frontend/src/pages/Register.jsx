import { Input } from "@/components/ui/input";
import { FaCheck } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useAuthAPI from "../hooks/api/useAuthAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import useUserAPI from "../hooks/api/useUserAPI";
import { twMerge } from "tailwind-merge";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { registerSchema } from "../schemas/auth";
import { toast } from "sonner";
import { baseURL } from "../utils/constants";

const Register = () => {
  const { token } = useContext(AuthContext);
  const { registerUser } = useAuthAPI();
  const { getAvailableAvatars } = useUserAPI();
  const navigate = useNavigate();

  const { data: avatars } = useQuery({
    queryKey: ["available_avatars"],
    queryFn: getAvailableAvatars,
    staleTime: Infinity,
  });

  const { mutate: register, isPending } = useMutation({
    mutationKey: ["user_register"],
    mutationFn: (data) => registerUser(data),
    onSuccess: () => navigate("/login/"),
    onError: (error) => {toast(error.response.data.message)},
  });

  useEffect(() => {
    if (token) {
      navigate("/");
    }
    if (!getValues("avatar")) {
      setValue("avatar", avatars?.[0]);
    }
  }, [avatars, token]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      avatar: avatars?.[0],
    },
  });

  const selectedAvatar = watch("avatar");

  return (
    <div
      className="relative w-full container lg:px-[18%] py-2 lg:py-[5%] flex flex-col justify-center gap-5 lg:gap-10
     "
    >
      <div className="py-2 lg:py-5 flex flex-col gap-3">
        <h6 className="font-semibold tracking-wide text-xl lg:text-3xl">
          Register a new account
        </h6>
        <small className="text-muted">
          Already have an account?{" "}
          <Link className="underline text-accent" to={"/login/"}>
            login
          </Link>
        </small>
      </div>
      <form
        className="flex flex-col lg:flex-row gap-5 lg:gap-16 w-full"
        onSubmit={handleSubmit(register)}
      >
        <div className="flex flex-wrap self-start gap-5 col-span-1 basis-[50%]">
          {avatars &&
            avatars.map((avatar, index) => (
              <div
                className={twMerge(
                  "hover:outline-indigo-500 outline outline-transparent outline-[3px] rounded-full size-[40px]  lg:size-[75px] cursor-pointer transition-all duration-300",
                  avatar === selectedAvatar
                    ? "outline-[3px] scale-125 lg:scale-110 outline-indigo-500"
                    : ""
                )}
                onClick={() => setValue("avatar", avatar)}
                key={index}
              >
                <img
                  className={" aspect-auto rounded-full"}
                  src={baseURL + avatar}
                ></img>
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-7 basis-[50%]">
          <div className="flex flex-col gap-1">
            <span className="text-muted tracking-wide text-sm md:text-base">
              Username
            </span>
            <Controller
              control={control}
              defaultValue={""}
              name="username"
              render={({ field }) => (
                <Input {...field} placeholder="Enter username" />
              )}
            />
            {errors.username && (
              <span className="text-xs text-red-500">
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-muted tracking-wide text-sm md:text-base">
              Password
            </span>
            <Controller
              control={control}
              defaultValue={""}
              name="password"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter password"
                  type="password"
                />
              )}
            />
            {errors.password && (
              <span className="text-xs text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted tracking-wide text-sm md:text-base">
              Confirm Password
            </span>
            <Controller
              control={control}
              defaultValue={""}
              name="re_password"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter password"
                  type="password"
                />
              )}
            />
            {errors.re_password && (
              <span className="text-xs text-red-500">
                {errors.re_password.message}
              </span>
            )}
          </div>
          <button
            className="bg-accent text-primary-button-text font-semibold h-[40px] mt-4 flex gap-2 items-center justify-center disabled:opacity-70"
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin text-xl" />
            ) : (
              <>
                <FaCheck />
                Register
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
