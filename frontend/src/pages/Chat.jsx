import { useContext, useEffect, useMemo, useState } from "react";
import ChatContext from "../contexts/ChatContext";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import useMessageAPI from "../hooks/api/useMessageAPI";
import useInfiniteQueryMutator from "../hooks/query/useInfiniteQueryMutator";
import ContactsList from "../components/chat/ContactsList";
import SidePanel from "../components/chat/SidePanel";
import Covnersation from "../components/chat/Covnersation";
import { useSearchParams } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";

const Chat = () => {
  const { incomingMessage, setIncomingMessage } = useContext(ChatContext);
  const [params, setParams] = useSearchParams();
  const { user } = useContext(AuthContext);
  const activeConversationId = parseInt(params.get("conversation") || "");
  const queryClient = useQueryClient();
  const { getConversations } = useMessageAPI();

  const data = useInfiniteQuery({
    queryKey: ["all_conversations"],
    queryFn: ({ pageParam }) => getConversations({ pageParam }),
    placeholderData: (prev) => prev,
    getNextPageParam: (lastPage) => lastPage?.next ?? undefined,
  });

  const conversationMutator = useInfiniteQueryMutator({
    queryKey: ["all_conversations"],
  });
  const messageMutator = useInfiniteQueryMutator({
    queryKey: [`messages_${activeConversationId}`],
  });

  const conversations = useMemo(
    () => conversationMutator.getCurrentItems(),
    [data.data]
  );
  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const handleConversationSelect = (conversation) => {
    params.set("conversation", conversation.id);
    setParams(params);
    if (!conversations.some((conv) => conv.id === conversation.id)) {
      queryClient.removeQueries("all_conversations");
    }
    conversationMutator.onUpdate(conversation);
  };

  useEffect(() => {
    if (incomingMessage?.conversation_id) {
      if (
        !conversations.some(
          (conv) => conv.id === incomingMessage.conversation_id
        )
      ) {
        queryClient.invalidateQueries("all_conversations");
      } else {
        const conversationToUpdate = conversations.find(
          (it) => it.id === incomingMessage.conversation_id
        );

        conversationMutator.onUpdate({
          id: incomingMessage.conversation_id,
          last_message: incomingMessage,
          ...(incomingMessage.participant.user_id !== user.id
            ? {
                unread_count: conversationToUpdate.unread_count + 1,
              }
            : {}),
          untracked_count: (conversationToUpdate.untracked_count || 0) + 1,
        });
      }

      if (
        activeConversationId === incomingMessage.conversation_id &&
        activeConversation &&
        activeConversation.last_message?.id !== incomingMessage.id
      ) {
        messageMutator.onAdd?.(incomingMessage, true);
      }
    }
    return () => setIncomingMessage(null);
  }, [incomingMessage]);

  return (
    <div className="grid grid-cols-12 gap-3 lg:py-5 h-[calc(100vh-60px)]">
      <ContactsList
        {...{ conversations, activeConversation, data }}
        onConversationSelected={handleConversationSelect}
      />
      {activeConversation ? (
        <>
          <Covnersation
            activeConversation={activeConversation}
            onUpdateConversation={conversationMutator.onUpdate}
          />
          <SidePanel activeConversation={activeConversation} />
        </>
      ) : (
        <NoConversation />
      )}
    </div>
  );
};

const NoConversation = () => (
  <div className="font-semibold relative place-items-center justify-center hidden lg:col-span-9 lg:flex shadow-sm bg-foreground flex-col gap-5">
    <span className="text-xl tracking-wide font-light">
      Select a conversation to begin
    </span>
  </div>
);

export default Chat;
