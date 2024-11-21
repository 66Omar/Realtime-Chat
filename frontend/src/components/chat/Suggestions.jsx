import useMessageAPI from "@/src/hooks/api/useMessageAPI";
import useUserAPI from "@/src/hooks/api/useUserAPI";
import { baseURL } from "@/src/utils/constants";
import { useMutation, useQuery } from "@tanstack/react-query";
import moment from "moment";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoPerson } from "react-icons/io5";

const Suggestions = ({ onConversationAdd }) => {
  const { getSuggestions } = useUserAPI();
  const { startConversation } = useMessageAPI();
  const {
    mutate: startUserConversation,
    isPending,
    variables,
  } = useMutation({
    mutationKey: ["start_conversation"],
    mutationFn: (userId) => startConversation(userId),
    onSuccess: (res) => {
      onConversationAdd(res);
    },
  });

  const { data: suggestions } = useQuery({
    queryKey: ["conversation_suggestions"],
    queryFn: getSuggestions,
  });

  return (
    suggestions && (
      <div className="flex flex-col animate-slideIn">
        <label className="text-accent tracking-wide text-sm flex gap-2 items-center uppercase px-5 pt-5 pb-3">
          <IoPerson className="text-xl" /> SUGGESTIONS
        </label>
        <div className="flex flex-col">
          {suggestions?.results?.map((contact) => (
            <button
              className="p-4 flex gap-4 hover:before:absolute hover:bg-secondary relative hover:before:w-[4px] hover:before:h-full hover:before:bg-accent  hover:before:left-0  cursor-pointer items-center"
              key={contact.id}
              disabled={isPending}
              onClick={() => startUserConversation(contact.id)}
            >
              <div>
                <img
                  src={baseURL + contact.avatar}
                  className="rounded-full size-[50px]"
                ></img>
              </div>
              <div className="flex-1 flex flex-row items-center ">
                <div className="flex flex-col">
                  <h6 className="text-muted self-start">{contact.username}</h6>
                  <small className="text-gray-400 self-start">
                    {moment(contact.created_at).fromNow()}
                  </small>
                </div>
                {variables === contact.id && (
                  <span className="ml-auto">
                    <AiOutlineLoading3Quarters className="animate-spin text-lg text-accent self-end" />
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  );
};

export default Suggestions;
