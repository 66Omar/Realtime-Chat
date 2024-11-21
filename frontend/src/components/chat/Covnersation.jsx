import useMessageAPI from "@/src/hooks/api/useMessageAPI";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useMemo } from "react";
import InfiniteScroll from "../common/InfiniteScroll";
import ChatMessage from "./ChatMessage";
import useInfiniteQueryMutator from "@/src/hooks/query/useInfiniteQueryMutator";
import ChatContext from "@/src/contexts/ChatContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ChatInput from "./ChatInput";
import ChatBanner from "./ChatBanner";

const Covnersation = ({ activeConversation, onUpdateConversation }) => {
  const { getMessages } = useMessageAPI();
  const { updateSeen } = useContext(ChatContext);
  const otherParticipant = activeConversation.participants[0];

  const data = useInfiniteQuery({
    queryKey: [`messages_${activeConversation?.id}`],
    queryFn: ({ pageParam = 0 }) =>
      getMessages({ pageParam, conversation: activeConversation }),
    getNextPageParam: (lastPage) => lastPage?.next ?? undefined,
    enabled: !!activeConversation,
  });

  const { resetCache, getCurrentItems } = useInfiniteQueryMutator({
    queryKey: [`messages_${activeConversation?.id}`],
  });

  const items = useMemo(() => getCurrentItems(), [data.data]);

  useEffect(() => {
    return () => resetCache();
  }, []);

  useEffect(() => {
    if (
      (activeConversation.untracked_count || activeConversation.unread_count) &&
      items.length
    ) {
      updateSeen({
        conversation_id: activeConversation.id,
        message_id: items[0].id,
      });
      onUpdateConversation({
        id: activeConversation.id,
        unread_count: 0,
        untracked_count: 0,
      });
    }
  }, [activeConversation, items]);

  return (
    activeConversation && (
      <div className="grid grid-rows-[8%,84%,8%] rounded-sm  h-full bg-foreground shadow-sm overflow-hidden col-span-full lg:col-span-6">
        <ChatBanner participant={otherParticipant} />
        <div className="p-5  flex flex-col gap-3 chat-scroll row-span-1 overflow-y-scroll chat-scroll">
          <InfiniteScroll
            queryData={data}
            loader={
              <div className="flex justify-center items-center">
                <AiOutlineLoading3Quarters className="animate-spin text-2xl text-accent" />
              </div>
            }
            className={"flex flex-col-reverse gap-3"}
          >
            {items.length ? (
              items.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  scrollInto={items[0].id === message?.id}
                />
              ))
            ) : (
              <div className="italic text-center self-center p-5 text-muted">
                {data.isLoading ? (
                  <span>
                    <AiOutlineLoading3Quarters className="animate-spin text-3xl text-accent" />
                  </span>
                ) : (
                  <div className="text-muted text-sm tracking-wide">
                    This is the beginning of your conversation with{" "}
                    {activeConversation?.participants
                      ?.map((participant) => participant.user.username)
                      .join(", ")}
                  </div>
                )}
              </div>
            )}
          </InfiniteScroll>
        </div>
        <ChatInput activeConversation={activeConversation} />
      </div>
    )
  );
};

export default Covnersation;
