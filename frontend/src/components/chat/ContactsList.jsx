import ContactTile, { ContactTileSkeleton } from "./ContactTile";
import InfiniteScroll from "../common/InfiniteScroll";
import React from "react";
import { IoChatbox } from "react-icons/io5";
import UserList from "../users/UserList";
import Suggestions from "./Suggestions";


const ContactsList = ({
  conversations,
  data,
  activeConversation,
  onConversationSelected,
}) => {

  function onConversationAdd(contact) {
    onConversationSelected(contact);
  }

  return (
    <div
      className={`flex flex-col ${
        activeConversation ? "hidden lg:flex" : "col-span-full"
      } lg:col-span-3 bg-foreground rounded-sm shadow-sm overflow-y-auto h-full chat-scroll self-start`}
    >
      <div className="flex items-center px-5 pt-5 pb-3">
        <label className="text-accent tracking-wide text-sm flex gap-2 items-center uppercase ">
          <IoChatbox className="text-xl" /> ACTIVE
        </label>
        <UserList onConversationAdd={onConversationAdd} />
      </div>
      <InfiniteScroll
        queryData={data}
        loader={<ContactTileSkeleton />}
        className={"flex flex-col pb-3"}
      >
        {conversations.length ? (
          conversations.map((conversation) => (
            <ContactTile
              key={conversation.id}
              isSelected={conversation.id === activeConversation?.id}
              conversation={conversation}
              onClick={() => onConversationSelected(conversation)}
            />
          ))
        ) : data.isLoading ? (
          <>
            <ContactTileSkeleton />
          </>
        ) : (
          <div className="p-5 rounded-lg text-center italic text-muted">
            No results
          </div>
        )}
      </InfiniteScroll>
      {!data.isLoading && !conversations.length && (
        <Suggestions onConversationAdd={onConversationAdd} />
      )}
    </div>
  );
};

export default ContactsList;
