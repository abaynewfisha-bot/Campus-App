import { useCallback, useState } from "react";

export function usePagination(initialPage = 1) {
  const [page, setPage] = useState(initialPage);

  const next = useCallback(() => setPage((current) => current + 1), []);
  const previous = useCallback(
    () => setPage((current) => Math.max(1, current - 1)),
    [],
  );
  const reset = useCallback(() => setPage(initialPage), [initialPage]);

  return { page, setPage, next, previous, reset };
}
