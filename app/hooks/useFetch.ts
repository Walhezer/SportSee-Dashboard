import { useState, useEffect } from "react";

/**
 * Custom hook to execute an asynchronous fetch function with reactive arguments.
 * Manages loading state, error catching, and prevents memory leaks via component unmount checks.
 */
export function useFetch<T, Args extends any[]>(
  fetchFunction: (...args: Args) => Promise<T>,
  args: Args
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function executeFetch() {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(...args);
        if (isMounted) {
          setData(result);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "A network error occurred");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    executeFetch();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...args]);

  return { data, isLoading, error };
}