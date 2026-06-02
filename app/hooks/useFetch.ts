import { useState, useEffect } from "react";

/**
 * Custom hook to execute an asynchronous fetch function.
 * Manages loading state, error handling, and prevents race conditions 
 * or memory leaks if the component unmounts.
 * * @template T - The type of the data returned by the fetch function.
 * @template Args - The type of the arguments array.
 * @param {Function} fetchFunction - The async function to execute.
 * @param {Args} args - The arguments to pass to the fetch function.
 * @returns {{ data: T | null, isLoading: boolean, error: string | null }}
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