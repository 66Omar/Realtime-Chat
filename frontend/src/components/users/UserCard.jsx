import { baseURL } from "@/src/utils/constants";
import moment from "moment";
import Emoji from "react-emoji-render";
import { IoChatbox, IoPeople } from "react-icons/io5";

const UserCard = ({ user }) => {
  return (
    user && (
      <div className="p-5 bg-foreground flex flex-col gap-5 rounded-none lg:rounded-md shadow-sm">
        <img className="size-[55px] lg:size-[75px] rounded-full" src={baseURL + user.avatar} />
        <div className="flex flex-col gap-5">
          <div>
            <h6 className="font-medium tracking-wide text-lg leading-5">
              {user.username}
            </h6>
            <small className="text-muted">
              Joined {moment(user.created_at).fromNow()}
            </small>
          </div>
          <div className="text-muted tracking-wide text-sm h-[40px] line-clamp-2">
            <Emoji> {user.description || ""}</Emoji>
          </div>
          <div className="flex items-start gap-3">
            <small className="bg-green-background text-green-foreground uppercase px-4 py-1 rounded-full tracking-wide font-medium flex gap-2 items-center">
              <IoChatbox /> {user.messageCount}
            </small>
            <small className="bg-blue-background text-blue-foreground uppercase px-4 py-1 rounded-full tracking-wide font-medium flex gap-2 items-center">
              <IoPeople /> {user?.participationsCount}
            </small>
          </div>
        </div>
      </div>
    )
  );
};

export default UserCard;
