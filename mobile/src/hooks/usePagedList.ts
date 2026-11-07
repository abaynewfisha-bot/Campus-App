import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "../services/apiClient";
import { ListParams, Paginated } from "../types";
import { useDebounce } from "./useDebounce";

type Fetcher<T> = (params: ListParams) => Promise<Paginated<T>>;

interface PagedListState<T> {
  items: T[];
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  total: number;
  totalPages: number;
  page: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

export function usePagedList<T>(
  fetcher: Fetcher<T>,
  options: { limit?: number } = {},
): PagedListState<T> {
  const limit = options.limit ?? 20;

  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 350);
  const requestId = useRef(0);

  const load = useCallback(
    async (targetPage: number, mode: "initial" | "refresh" | "more") => {
      const id = requestId.current + 1;
      requestId.current = id;

      if (mode === "refresh") {
        setIsRefreshing(true);
      } else if (mode === "more") {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      setError(null);

      try {
        const result = await fetcher({
          page: targetPage,
          limit,
          search: debouncedSearch || undefined,
          category: category || undefined,
        });

        if (id !== requestId.current) {
          return;
        }

        setTotal(result.meta.total);
        setTotalPages(result.meta.totalPages);
        setPage(targetPage);
        setItems((previous) =>
          mode === "more" ? [...previous, ...result.data] : result.data,
        );
      } catch (loadError) {
        if (id === requestId.current) {
          setError(getErrorMessage(loadError));
        }
      } finally {
        if (id === requestId.current) {
          setIsLoading(false);
          setIsRefreshing(false);
          setIsLoadingMore(false);
        }
      }
    },
    [fetcher, limit, debouncedSearch, category],
  );

  useEffect(() => {
    void load(1, "initial");
  }, [load]);

  const refresh = useCallback(async () => {
    await load(1, "refresh");
  }, [load]);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || page >= totalPages) {
      return;
    }

    await load(page + 1, "more");
  }, [isLoading, isLoadingMore, page, totalPages, load]);

  const retry = useCallback(async () => {
    await load(1, "initial");
  }, [load]);

  return {
    items,
    search,
    setSearch,
    category,
    setCategory,
    total,
    totalPages,
    page,
    isLoading,
    isRefreshing,
    isLoadingMore,
    error,
    refresh,
    loadMore,
    retry,
  };
}
