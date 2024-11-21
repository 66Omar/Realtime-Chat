import { useQueryClient } from "@tanstack/react-query";

const useInfiniteQueryMutator = ({ queryKey }) => {
  const queryClient = useQueryClient();

  function onUpdate(item) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return data;

      const updatedPages = data.pages.map((page) => {
        const updatedResults = page.results.map((it) => {
          if (item.id === it.id) {
            return { ...it, ...item, lastQueryUpdate: new Date() };
          }
          return it;
        });

        return {
          ...page,
          results: updatedResults,
        };
      });

      return {
        ...data,
        pages: updatedPages,
      };
    });
  }

  function onDelete(item) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return data;

      const updatedPages = data.pages.map((page) => ({
        ...page,
        results: page.results.filter((it) => it.id !== item.id),
      }));

      return {
        ...data,
        pages: updatedPages,
      };
    });
  }

  function onAdd(item, reverse = false) {
    queryClient.setQueryData(queryKey, (data) => {
      if (!data) return;

      const updatedPages = [...data.pages];

      if (!reverse) {
        const lastPageIndex = updatedPages.length - 1;
        if (lastPageIndex >= 0) {
          updatedPages[lastPageIndex] = {
            ...updatedPages[lastPageIndex],
            results: [...updatedPages[lastPageIndex].results, item],
          };
        }
      } else {
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            results: [item, ...updatedPages[0].results],
          };
        }
      }

      return {
        ...data,
        pages: updatedPages,
      };
    });
  }

  function getById(id) {
    const data = queryClient.getQueryData(queryKey);
    if (!data) return null;
    for (const page of data.pages) {
      const item = page.results.find((it) => it.id === id);
      if (item) return item;
    }
    return null;
  }


  function getCurrentItems() {
    const data = queryClient.getQueryData(queryKey);
    if (!data || !data.pages) {
      return [];
    }

    return data.pages.flatMap((page) => page?.results || []);
  }

  function resetCache() {
    queryClient.setQueryData(queryKey, (prev) => {
      if (prev)
        return {
          pages: prev.pages.slice(0, 1),
          pageParams: prev.pageParams.slice(0, 1),
        };
    });
  }
  return { onUpdate, onDelete, onAdd, resetCache, getById, getCurrentItems };
};

export default useInfiniteQueryMutator;
