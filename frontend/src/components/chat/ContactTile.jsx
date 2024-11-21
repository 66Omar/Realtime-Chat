import { Skeleton } from "@/components/ui/skeleton";
import AuthContext from "@/src/contexts/AuthContext";
import { baseURL } from "@/src/utils/constants";
import { useContext } from "react";
import { twMerge } from "tailwind-merge";

const ContactTile = ({ conversation, isSelected, className, ...props }) => {
  const { user } = useContext(AuthContext);
  const participant = conversation.participants[0];

  return (
    <button
      className={twMerge(
        "p-4 flex gap-4 hover:before:absolute flex-wrap hover:bg-secondary hover:before:w-[4px] hover:before:h-full relative hover:before:bg-accent hover:before:left-0 cursor-pointer items-center",
        isSelected &&
          "before:content-[''] before:absolute before:w-[4px] before:h-full before:bg-accent before:left-0",
        className
      )}
      {...props}
    >
      <div>
        <img
          src={baseURL + participant.user.avatar}
          className="rounded-full size-[50px]"
        ></img>
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col items-start">
          <h6>{participant.user.username}</h6>
          {conversation.last_message && (
            <small className="text-start text-muted line-clamp-1">
              {conversation.last_message.participant?.user.id === user.id
                ? "You: "
                : `${conversation.last_message.participant?.user?.username}: `}
              {conversation.last_message.content}
            </small>
          )}
        </div>
        <div className="ml-auto">
          {conversation.unread_count > 0 && (
            <span className="rounded-full bg-orange-background text-orange-foreground text-xs min-w-[20px] min-h-[20px] font-medium flex justify-center place-items-center items-center px-1">
              {conversation.unread_count}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

export const ContactTileSkeleton = () => {
  return (
    <div className="p-4 w-full flex gap-5 hover:before:absolute hover:before:w-[5px]  rounded-lg cursor-pointer items-center">
      <Skeleton className="size-[50px] bg-primary rounded-full flex-shrink-0"></Skeleton>
      <div className="flex flex-col w-full gap-3">
        <Skeleton className="h-3 w-[60%] bg-primary rounded-lg"></Skeleton>
        <Skeleton className="h-2 bg-primary w-[25%] rounded-lg"></Skeleton>
      </div>
    </div>
  );
};

export default ContactTile;
