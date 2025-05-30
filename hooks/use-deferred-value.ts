import { useState, useEffect } from "react";

/**
 * A hook that returns a deferred version of the provided value,
 * which helps to avoid blocking the UI during heavy computations.
 *
 * @param value The value to defer
 * @param delay Optional delay in milliseconds, defaults to 300ms
 * @returns The deferred value
 */
export function useDeferredValue<T>(value: T, delay = 300): T {
  const [deferredValue, setDeferredValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDeferredValue(value);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return deferredValue;
}

export default useDeferredValue;
