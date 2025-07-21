import { useCallback, useRef } from "react";

/**
 * Custom hook to prevent rapid successive function calls (debouncing)
 * Useful for preventing double-clicks on buttons
 */
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300
): ((...args: Parameters<T>) => void) => {
  const timeoutRef = useRef<number | null>(null);
  const isExecutingRef = useRef<boolean>(false);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If already executing, ignore subsequent calls
      if (isExecutingRef.current) {
        return;
      }

      timeoutRef.current = window.setTimeout(async () => {
        isExecutingRef.current = true;

        try {
          await callback(...args);
        } finally {
          isExecutingRef.current = false;
        }
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

/**
 * Custom hook for form submissions with debouncing and loading state
 */
export const useSubmitWithDebounce = <
  T extends (...args: any[]) => Promise<any>
>(
  callback: T,
  delay: number = 500
) => {
  const isLoadingRef = useRef<boolean>(false);

  const debouncedSubmit = useCallback(
    async (...args: Parameters<T>) => {
      // Prevent double submissions
      if (isLoadingRef.current) {
        return;
      }

      isLoadingRef.current = true;

      try {
        await callback(...args);
      } finally {
        // Add a small delay before allowing next submission
        setTimeout(() => {
          isLoadingRef.current = false;
        }, delay);
      }
    },
    [callback, delay]
  );

  return {
    submit: debouncedSubmit,
    isLoading: () => isLoadingRef.current,
  };
};
