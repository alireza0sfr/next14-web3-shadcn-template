import { useEffect, useState } from "react";

/**
 * A custom React hook to debounce a value, delaying its update until a specified time has passed without further changes.
 *
 * @template T - The type of the value to debounce.
 * @param {T} value - The value to debounce.
 * @param {number} [delay=500] - The delay in milliseconds before the debounced value is updated.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 300);
 *
 * useEffect(() => {
 *   // Perform search or other actions with debouncedSearchTerm
 * }, [debouncedSearchTerm]);
 *
 * return (
 *   <input
 *     type="text"
 *     value={searchTerm}
 *     onChange={(e) => setSearchTerm(e.target.value)}
 *     placeholder="Search..."
 *   />
 * );
 */

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update the debounced value after the specified delay
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    // Cleanup function to clear the timeout if the value or delay changes
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
