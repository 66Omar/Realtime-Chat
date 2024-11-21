import { Input } from "@/components/ui/input";
import ChatContext from "@/src/contexts/ChatContext";
import { messageSchema } from "@/src/schemas/message";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { IoIosSend } from "react-icons/io";

const ChatInput = ({ activeConversation }) => {
  const { sendMessage } = useContext(ChatContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({ resolver: zodResolver(messageSchema), mode: "onSubmit" });

  function onSubmit(data) {
    sendMessage({
      type: "send_message",
      content: data.content,
      conversation_id: activeConversation.id,
    });
    reset();
  }

  return (
    <div className="flex items-center lg:px-4 h-full border-t border-t-border row-span-1 lg:py-[10px] text-sm md:text-base lg:bg-transparent bg-background">
      <form
        className="flex w-full items-center gap-1 h-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          control={control}
          name="content"
          defaultValue={""}
          render={({ field }) => (
            <Input
              {...field}
              onBlur={() => clearErrors("content")}
              ref={null}
              autoComplete="off"
              name="content"
              placeholder="Enter your message"
              className={`w-full h-full border-transparent focus:outline-none bg-transparent md:bg-primary px-3  placeholder:tracking-wide rounded-none lg:rounded-md ${
                errors.content && "ring-1 ring-red-400 placeholder:text-red-400"
              }`}
            />
          )}
        />

        <button className="text-3xl text-accent px-2 transition-all duration-300 group h-full">
          <span>
            <IoIosSend className="group-hover:scale-105 transition-all duration-300" />
          </span>
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
