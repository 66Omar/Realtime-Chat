import { baseURL } from "@/src/utils/constants";
import moment from "moment";
import Emoji from "react-emoji-render";
import { IoChatbox } from "react-icons/io5";
import { MdEmojiPeople } from "react-icons/md";

const SidePanel = ({ activeConversation }) => {
  const participant = activeConversation.participants[0];
  const isRecentlyJoined =
    participant.user?.created_at &&
    Date.now() - new Date(participant.user?.created_at).getTime() <
      24 * 60 * 60 * 1000;

  return (
    participant && (
      <div
        className={`self-start bg-foreground shadow-sm rounded-sm col-span-full lg:col-span-3 p-5 ${
          activeConversation ? "lg:flex hidden" : "lg:col-span-3"
        }`}
      >
        <div className="flex flex-col gap-5">
          <img
            src={baseURL + participant.user.avatar}
            className="size-[75px] rounded-full"
          />
          <div className="flex flex-col gap-2">
            <h6 className="font-semibold tracking-wide text-xl leading-none ">
              {participant.user.username}
            </h6>
            <small className="text-muted">
              Joined {moment(participant.user.created_at).fromNow()}
            </small>
          </div>
          {participant.user.description && (
            <Emoji className="text-sm text-muted tracking-wide break-words py-2">
              {participant.user.description}
            </Emoji>
          )}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="p-2 bg-green-background text-green-foreground text-xs font-medium flex items-center gap-2 uppercase">
              <span>
                <IoChatbox className="text-base" />
              </span>
              started {moment(activeConversation?.created_at).fromNow()}
            </span>
            {isRecentlyJoined && (
              <span className="p-2 bg-blue-background text-blue-foreground text-xs font-medium flex items-center gap-2">
                <span>
                  <MdEmojiPeople className="text-base" />
                </span>
                JOINED RECENTLY
              </span>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default SidePanel;
