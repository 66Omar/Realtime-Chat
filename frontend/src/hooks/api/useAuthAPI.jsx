import useAxios from "./useAxios";

export default function useAuthAPI() {
  const axiosInstance = useAxios()
  function loginUser(data) {
    const response = axiosInstance.post("auth/login/", data);
    return response;
  }

  function registerUser(data) {
    const response = axiosInstance.post("auth/register/", data);
    return response;
  }

  return {
    loginUser,
    registerUser,
  };
}
