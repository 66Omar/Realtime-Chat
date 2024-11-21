import { Input } from "@/components/ui/input";
import useMessageAPI from "@/src/hooks/api/useMessageAPI";
import useUserAPI from "@/src/hooks/api/useUserAPI";
import { baseURL } from "@/src/utils/constants";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import InfiniteScroll from "../common/InfiniteScroll";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaPlus } from "react-icons/fa6";
import "../../index.css";
import useInfiniteQueryMutator from "@/src/hooks/query/useInfiniteQueryMutator";

const UserList = ({ onConversationAdd }) => {
  const queryClient = useQueryClient();

  const { getSuggestions } = useUserAPI();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState();
  const [isAdding, setIsAdding] = useState(false);
  const debouncedSearch = useDebounce(query, 400);

  const data = useInfiniteQuery({
    queryKey: ["available_contacts", debouncedSearch],
    queryFn: ({ pageParam }) => getSuggestions({ pageParam, query }),
    getNextPageParam: (lastPage, pages) => lastPage.next ?? undefined,
    enabled: open,
  });
  const { getCurrentItems } = useInfiniteQueryMutator({
    queryKey: ["available_contacts", debouncedSearch],
  });
  const suggestions = getCurrentItems();

  function onUserSelected(selectedUser, createdConversation) {
    setIsAdding(false);
    onConversationAdd(createdConversation);
    queryClient.removeQueries("available_contacts");
    setOpen(false);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="border-none focus:border-none focus-within:outline-none select-none ml-auto">
        <span className="p-2 text-lg  rounded-full hover:bg-secondary flex justify-center ml-auto text-accent">
          <FaPlus />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={
          "bg-foreground border-border border shadow-md w-[350px] z-10 text-text"
        }
      >
        <div className="flex flex-col py-1 max-h-[350px] overflow-auto chat-scroll">
          <div className="pb-2 px-1">
            <Input
              onChange={(e) => setQuery(e.target.value)}
              className={"border-none bg-primary placeholder:tracking-wide"}
              placeholder={"Search users..."}
            />
          </div>
          <InfiniteScroll
            queryData={data}
            loader={
              <div className="flex justify-center items-center">
                <AiOutlineLoading3Quarters className="animate-spin text-lg text-accent" />
              </div>
            }
            className={"flex flex-col"}
          >
            {suggestions.length ? (
              suggestions.map((suggestion) => (
                <UserItem
                  key={suggestion.id}
                  user={suggestion}
                  isAdding={isAdding}
                  setIsAdding={setIsAdding}
                  onUserSelected={onUserSelected}
                />
              ))
            ) : (
              <div className="italic text-center self-center p-5 text-muted text-sm">
                {data.isLoading ? (
                  <span>
                    <AiOutlineLoading3Quarters className="animate-spin text-lg text-accent" />
                  </span>
                ) : (
                  `No results`
                )}
              </div>
            )}
          </InfiniteScroll>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserItem = ({ user, onUserSelected, isAdding, setIsAdding }) => {
  const { startConversation } = useMessageAPI();
  const { mutate: startUserConversation, isPending } = useMutation({
    mutationKey: ["start_conversation"],
    mutationFn: () => startConversation(user.id),
    onMutate: () => setIsAdding(true),
    onSuccess: (res) => {
      onUserSelected(user, res);
    },
  });

  return (
    <button
      className="p-[9px] cursor-pointer hover:bg-secondary flex items-center gap-3"
      onClick={startUserConversation}
      disabled={isAdding}
    >
      <img
        src={baseURL + user.avatar}
        className="size-[35px] rounded-full"
      ></img>
      {user.username}
      {isPending && (
        <span className="ml-auto">
          <AiOutlineLoading3Quarters className="animate-spin text-base text-accent" />
        </span>
      )}
    </button>
  );
};

export default UserList;
