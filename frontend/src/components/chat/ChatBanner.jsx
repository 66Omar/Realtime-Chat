import { baseURL } from "@/src/utils/constants";
import { FaArrowLeft } from "react-icons/fa6";
import { useSearchParams } from "react-router-dom";

const ChatBanner = ({ participant }) => {
  const [params, setParams] = useSearchParams();
  return (
    <div className="p-4  flex gap-3 items-center h-full border-b border-b-border row-span-1">
      <span className="flex gap-2 items-center">
        <button
          className="lg:hidden text-accent p-2 hover:bg-primary rounded-full"
          onClick={() => {
            params.delete("conversation");
            setParams(params);
          }}
        >
          <FaArrowLeft />
        </button>
        <img
          src={baseURL + participant.user.avatar}
          className="rounded-full size-[35px]"
        ></img>
      </span>
      <h6 className="font-medium text-muted tracking-wide">
        {participant.user.username}
      </h6>
    </div>
  );
};

export default ChatBanner;
