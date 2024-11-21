import { Input } from "@/components/ui/input";
import { FaRightToBracket } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import useAuthAPI from "../hooks/api/useAuthAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import AuthContext from "../contexts/AuthContext";
import { loginSchema } from "../schemas/auth";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const { token, setToken } = useContext(AuthContext);
  const { mutate: login, isPending } = useMutation({
    mutationKey: "user_login",
    mutationFn: (data) => loginUser(data),
    onSuccess: (res) => {
      localStorage.setItem("userToken", res?.data?.token);
      setToken(res?.data?.token);
    },
    onError: (error) => {
      toast(error.response.data.message);
      reset({ password: "", username: getValues("username") || "" });
    },
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (token) {
      const next = params.get("next");
      navigate(next || "/");
    }
  }, [token]);

  const { loginUser } = useAuthAPI();
  return (
    <div className="relative">
      <div className="fixed px-5 md:px-0 top-[40%] right-[50%] translate-x-1/2 -translate-y-1/2">
        <form
          className="flex flex-col gap-7 p-5 rounded-xl w-[350px] md:w-[400px]"
          onSubmit={handleSubmit(login)}
        >
          <div className="py-5 flex flex-col gap-3">
            <h6 className="font-medium text-xl lg:text-3xl text-center">
              Login
            </h6>
            <small className="text-center text-muted">
              {"No account? Sign up "}
              <Link className="underline text-accent" to={"/register/"}>
                here
              </Link>
            </small>
          </div>
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
          <button
            className="bg-accent text-primary-button-text font-semibold h-[40px] mt-4 flex gap-2 items-center justify-center disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin text-xl" />
            ) : (
              <>
                <FaRightToBracket />
                Login
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
