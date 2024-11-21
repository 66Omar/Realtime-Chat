import { useInfiniteQuery } from "@tanstack/react-query";
import useUserAPI from "../hooks/api/useUserAPI";
import UserCard from "../components/users/UserCard";
import React, { useEffect, useMemo } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import InfiniteScroll from "../components/common/InfiniteScroll";
import useInfiniteQueryMutator from "../hooks/query/useInfiniteQueryMutator";

const Users = () => {
  const { getUsers } = useUserAPI();
  const data = useInfiniteQuery({
    queryKey: ["all_users"],
    queryFn: ({ pageParam }) => getUsers({ pageParam }),
    getNextPageParam: (lastPage) => lastPage?.next ?? undefined,
  });
  const { getCurrentItems, resetCache } = useInfiniteQueryMutator({
    queryKey: ["all_users"],
  });
  const users = useMemo(() => getCurrentItems(), [data.data]);

  useEffect(() => {
    return () => resetCache();
  }, []);

  if (data.isLoading) {
    return (
      <div className="flex justify-center items-center col-span-full py-2">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-accent" />
      </div>
    );
  }

  return (
    users && (
      <InfiniteScroll
        queryData={data}
        rootMargin={"10px"}
        loader={
          <div className="flex justify-center items-center col-span-full">
            <AiOutlineLoading3Quarters className="animate-spin text-3xl text-accent" />
          </div>
        }
        className={
          "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 lg:gap-4 gap-2 overflow-y-auto max-h-full lg:py-5"
        }
      >
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </InfiniteScroll>
    )
  );
};

export default Users;
