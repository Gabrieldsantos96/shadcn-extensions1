import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

export type SearchResponse<T = any> = {
  data: T[];
  hasMore: boolean;
  total: number;
};

type UseInfiniteScrollProps<T> = {
  queryKey: string;
  searchTerm: string;
  asyncSearchFn: (
    searchTerm: string,
    page: number,
    pageSize: number
  ) => Promise<SearchResponse<T>>;
  pageSize?: number;
};

export function useInfiniteScroll<T>({
  queryKey,
  searchTerm,
  asyncSearchFn,
  pageSize = 10,
}: UseInfiniteScrollProps<T>) {
  const observer = React.useRef<IntersectionObserver>(undefined);

  const {
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey, searchTerm],
    queryFn: ({ pageParam = 1 }) =>
      asyncSearchFn(searchTerm, pageParam, pageSize),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.length ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allData = data?.pages.flatMap((page) => page.data) ?? [];

  const lastElementRef = React.useCallback(
    (node: HTMLDivElement) => {
      if (isLoading || isFetching) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0]?.isIntersecting &&
          hasNextPage &&
          !isLoading &&
          !isFetching
        ) {
          fetchNextPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  );

  return {
    data: allData,
    error,
    fetchNextPage,
    isFetching,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    lastElementRef,
  };
}
