import { useEffect, useRef } from "react";

const InfiniteScroll = ({
  className,
  children,
  loader,
  rootMargin,
  queryData,
}) => {
  const loadMoreRef = useRef();
  const containerRef = useRef();
  const { fetchNextPage, hasNextPage, loaderClass, isFetchingNextPage } =
    queryData;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage().finally(() => {
            loadMoreRef.current.scrollIntoView();
          });
        }
      },
      {
        rootMargin: rootMargin || "100px",
      }
    );

    const currentLoadMoreRef = loadMoreRef.current;
    if (currentLoadMoreRef) {
      observer.observe(currentLoadMoreRef);
    }

    return () => {
      if (currentLoadMoreRef) {
        observer.unobserve(currentLoadMoreRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, rootMargin]);

  return (
    <div ref={containerRef} className={className}>
      {children}
      {hasNextPage && (
        <div
          className="col-span-full"
          ref={loadMoreRef}
          aria-busy={isFetchingNextPage}
        >
          {isFetchingNextPage && (
            <div className={loaderClass || className}>{loader}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfiniteScroll;
