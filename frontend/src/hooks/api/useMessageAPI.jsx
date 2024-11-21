import useAxios from "./useAxios";

const useMessageAPI = () => {
  const axiosInstance = useAxios();

  async function getConversations({ pageParam }) {
    const response = await axiosInstance.get(
      `/conversations/${pageParam ? `?offset=${pageParam}` : ""}`
    );
    return response.data;
  }

  async function getMessages({ pageParam, conversation }) {
    const response = await axiosInstance.get(
      `/conversations/${conversation?.id}${
        pageParam ? `?cursor=${pageParam}` : ""
      } `
    );
    return response.data;
  }

  async function startConversation(user_id) {
    const response = await axiosInstance.post(`/conversations/`, {
      user_id: user_id,
    });
    return response.data;
  }

  return {
    getMessages,
    getConversations,
    startConversation,
  };
};

export default useMessageAPI;
