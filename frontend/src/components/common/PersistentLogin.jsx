import { Outlet } from "react-router-dom";
import AuthLoading from "./AuthLoading";
import { useContext, useEffect } from "react";
import AuthContext from "@/src/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useUserAPI from "@/src/hooks/api/useUserAPI";

const PersistentLogin = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const { getCurrentUser } = useUserAPI();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["current_user", token],
    enabled: !!token,
    queryFn: getCurrentUser,
  });

  useEffect(() => {
    if (isSuccess) {
      setUser(data);
    }
  }, [isSuccess]);

  return !token ? <Outlet /> : !user | isLoading ? <AuthLoading /> : <Outlet />;
};

export default PersistentLogin;
