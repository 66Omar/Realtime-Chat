import AuthContext from "@/src/contexts/AuthContext";
import moment from "moment";
import { useContext, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

const ChatMessage = ({ message, className, scrollInto }) => {
  const { user } = useContext(AuthContext);
  const messageRef = useRef();
  const time = moment(message.created_at).calendar(null, {
  sameDay: '[Today], h:mm A',
  lastDay: '[Yesterday], h:mm A',
  lastWeek: 'dddd, h:mm A',
  sameElse: 'MM/DD/YYYY, h:mm A'
});

  useEffect(() => {
    if (scrollInto) {
      messageRef.current?.scrollIntoView();
    }
  }, [scrollInto]);

  return (
    <div
      className={twMerge(
        "self-start max-w-[85%] lg:max-w-[60%] break-words text-sm md:text-base ",
        `${message.participant.user_id === user.id && "self-end"}`,
        `${scrollInto && "animate-slideIn"}`,
        className
      )}
    >
      <div
        className={twMerge(
          "p-2 lg:p-3  bg-primary rounded-lg min-w-[130px] text-text  flex flex-col",
          `${message.participant.user_id === user.id && " bg-secondary "}`
        )}
        ref={messageRef}
      >
        {message?.content}
        <small className="ml-auto text-muted ">{time}</small>
      </div>
    </div>
  );
};

export default ChatMessage;
