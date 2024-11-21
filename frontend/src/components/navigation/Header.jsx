import AuthContext from "@/src/contexts/AuthContext";
import { useContext } from "react";
import { FaCube, FaFire } from "react-icons/fa6";
import { IoChatbox, IoPerson } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import { twMerge } from "tailwind-merge";
import { useQuery } from "@tanstack/react-query";
import useUserAPI from "@/src/hooks/api/useUserAPI";

const Header = () => {
  const { user } = useContext(AuthContext);
  const { getUsersCount } = useUserAPI();
  const { data: usersCount } = useQuery({
    queryKey: ["users_count", user],
    queryFn: getUsersCount,
  });
  return (
    <header>
      <nav className="bg-foreground h-[60px] py-2.5 border-b border-border flex items-center w-full">
        <div className="grid grid-cols-3 px-4 lg:container w-full items-center">
          <Link to={"/"} className="flex items-center gap-2">
            <FaCube className="text-2xl lg:text-xl text-accent" />
            <span className="self-center text-xl font-semibold whitespace-nowrap  lg:block hidden">
              Chat
            </span>
          </Link>
          <div className="flex items-center order-last gap-2 col-span-1 justify-end">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-5 font-medium text-sm text-text h-[40px] justify-center items-center hover:bg-primary rounded-md hidden lg:flex"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="font-medium text-primary-button-text bg-accent h-[40px] px-2 text-xs md:text-base lg:w-[120px] rounded-sm flex items-center justify-center"
                >
                  Get started
                </Link>
              </>
            ) : (
              <HeaderMenu />
            )}
          </div>
          <div className="col-span-1 order-2 justify-between items-center w-full lg:flex lg:w-auto lg:order-1 justify-self-center self-center">
            <ul className="flex font-medium lg:flex-row gap-1 lg:mt-0 h-full justify-center">
              <HeaderItem
                to="/"
                icon={<IoChatbox className="text-2xl lg:text-base" />}
              >
                Chat
              </HeaderItem>
              <HeaderItem
                to="/users/"
                icon={<IoPerson className="text-2xl lg:text-base" />}
              >
                Users
                {usersCount > 0 && (
                  <span className=" flex items-center gap-1 py-1 px-2 bg-orange-background text-orange-foreground rounded-full text-xs font-medium">
                    <FaFire /> {usersCount}
                  </span>
                )}
              </HeaderItem>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

const HeaderItem = ({ to, icon, children }) => {
  const { pathname } = useLocation();
  return (
    <li>
      <Link
        className={twMerge(
          "lg:hover:bg-primary  text-muted flex items-center gap-2 h-[40px] px-4 rounded-md transition-colors duration-300",
          pathname === to ? " text-accent bg-primary lg:bg-transparent" : ""
        )}
        to={to}
      >
        <span>{icon}</span>
        <span className="hidden lg:flex gap-2 items-center">{children}</span>
      </Link>
    </li>
  );
};

export default Header;
