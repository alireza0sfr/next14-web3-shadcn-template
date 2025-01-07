import { useEffect } from "react";

import useTimeout from "./useTimeout";
import type { Callback } from "~/types/hooks/general";

/**
 * A custom React hook to debounce a callback function, delaying its execution until a specified time has passed without further changes.
 *
 * @param {Callback} callback - The callback function to debounce.
 * @param {number} delay - The delay in milliseconds before the callback is executed.
 * @param {React.DependencyList} dependencies - The dependencies that trigger the debounced callback.
 *
 * @example
 * const [value, setValue] = useState("");
 *
 * useDebounceCallback(() => {
 *   console.log("Debounced value:", value);
 * }, 1000, [value]);
 *
 * return (
 *   <input
 *     type="text"
 *     value={value}
 *     onChange={(e) => setValue(e.target.value)}
 *     placeholder="Type something..."
 *   />
 * );
 */

export default function useDebounceCallback(
  callback: Callback,
  delay: number,
  dependencies: React.DependencyList
) {
  const { reset, clear } = useTimeout(callback, delay);

  // Reset the timeout whenever dependencies change
  useEffect(reset, [...dependencies, reset]);

  // Clear the timeout when the component unmounts
  useEffect(clear, []);
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#3-usedebounce
