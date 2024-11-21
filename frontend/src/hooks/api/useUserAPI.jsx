import useAxios from "./useAxios";

export default function useUserAPI() {
  const axiosInstance = useAxios();

  async function getCurrentUser() {
    const response = await axiosInstance.get("/users/me/");
    return response.data;
  }

  async function getAvailableAvatars() {
    const res = await axiosInstance.get("/users/avatars/");
    return res.data;
  }

  async function getSuggestions({ pageParam, query }) {
    const searchParams = new URLSearchParams();
    if (pageParam) searchParams.append("offset", pageParam);
    if (query) searchParams.append("q", query);
    const res = await axiosInstance.get(
      `/users/suggestions/?${searchParams && searchParams.toString()}`
    );
    return res.data;
  }

  async function getUsers({ pageParam }) {
    const response = await axiosInstance.get(
      `/users/${pageParam ? `?cursor=${pageParam}` : ""}`
    );
    return response.data;
  }

  async function getUsersCount() {
    const response = await axiosInstance.get("/users/count");
    return response.data;
  }

  return {
    getCurrentUser,
    getUsers,
    getUsersCount,
    getAvailableAvatars,
    getSuggestions,
  };
}
