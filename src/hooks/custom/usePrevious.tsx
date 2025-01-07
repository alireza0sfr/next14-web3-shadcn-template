import { useRef } from "react";

/**
 * Custom hook to track the previous value of a variable.
 *
 * @template T - The type of the value to track.
 * @param {T} value - The current value to track.
 * @returns {T | undefined} - The previous value of the variable.
 *
 * @example
 * const [count, setCount] = useState(0);
 * const previousCount = usePrevious(count);
 *
 * return (
 *   <div>
 *     <p>Current Count: {count}</p>
 *     <p>Previous Count: {previousCount !== undefined ? previousCount : "No previous value"}</p>
 *     <button onClick={() => setCount(count + 1)}>Increment</button>
 *   </div>
 * );
 */

export default function usePrevious<T>(value: T): T | undefined {
  const currentRef = useRef<T>(value);
  const previousRef = useRef<T>();

  // Update the previous value if the current value has changed
  if (currentRef.current !== value) {
    previousRef.current = currentRef.current;
    currentRef.current = value;
  }

  return previousRef.current;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#6-useprevious
