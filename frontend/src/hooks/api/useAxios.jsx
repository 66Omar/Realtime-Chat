import AuthContext from "@/src/contexts/AuthContext";
import { useContext, useEffect } from "react";
import { axiosInstance } from ".";

export default function useAxios() {
  const { token, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error?.response?.status === 403 ||
          error?.response?.status === 401
        ) {
          logoutUser(true);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [token]);

  return axiosInstance;
}
