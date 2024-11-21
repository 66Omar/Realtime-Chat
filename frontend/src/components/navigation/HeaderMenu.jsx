import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { baseURL } from "@/src/utils/constants";
import { useContext } from "react";
import {
  FaArrowRightFromBracket,
  FaGear,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import AuthContext from "@/src/contexts/AuthContext";
import ThemeContext from "@/src/contexts/ThemeContext";

const HeaderMenu = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none focus:border-none focus-within:outline-none select-none ">
        <div className="flex gap-2 items-center">
          <img
            src={baseURL + user.avatar}
            className="size-[35px] lg:size-[30px] rounded-full"
          />
          <span className="lg:block hidden">{user?.username}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={"bg-foreground border-border min-w-[200px]"}
      >
        <ThemeOption
          icon={<FaSun className="text-yellow-400" />}
          name={"light"}
        />
        <ThemeOption icon={<FaMoon className=" text-black" />} name={"dark"} />
        <ThemeOption
          icon={<FaGear className="text-accent" />}
          name={"system"}
        />

        <DropdownMenuItem
          className={
            "cursor-pointer flex gap-2 min-h-[2.5rem] items-center text-muted focus:bg-secondary focus:text-text"
          }
          onClick={() => logoutUser(false)}
        >
          <FaArrowRightFromBracket className="rotate-180" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ThemeOption = ({ icon, name }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <DropdownMenuItem
      className={
        "cursor-pointer flex gap-2 min-h-[2.5rem] items-center  text-muted focus:bg-secondary focus:text-text"
      }
      onClick={() => setTheme(name)}
    >
      {icon} {name.charAt(0).toUpperCase() + name.slice(1)}
      {theme === name && <CurrentThemeIndicator />}
    </DropdownMenuItem>
  );
};

const CurrentThemeIndicator = () => {
  return (
    <span className="tracking-wide text-[0.7rem] py-[1px] px-2 focus bg-secondary text-accent ml-auto rounded-full">
      ON
    </span>
  );
};

export default HeaderMenu;
