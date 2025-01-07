import { useCallback, useRef, useState } from "react";

interface Options {
  /**
   * The maximum capacity of the history stack.
   * @default 10
   */
  capacity?: number;
}

/**
 * A custom React hook that extends the functionality of `useState` by maintaining a history of state changes.
 * It allows navigating back and forth through the history stack.
 *
 * @template T - The type of the state value.
 * @param {T} defaultValue - The initial value of the state.
 * @param {Options} [options] - Optional configuration for the history stack.
 * @returns {Array} - An array containing the current state value, a state setter function, and an object with history navigation methods.
 *
 * @example
 * const [value, setValue, { history, pointer, back, forward, go }] = useStateWithHistory(0, { capacity: 5 });
 *
 * return (
 *   <div>
 *     <p>Current Value: {value}</p>
 *     <button onClick={() => setValue(value + 1)}>Increment</button>
 *     <button onClick={back}>Back</button>
 *     <button onClick={forward}>Forward</button>
 *     <button onClick={() => go(2)}>Go to Index 2</button>
 *     <p>History: {history.join(", ")}</p>
 *     <p>Pointer: {pointer}</p>
 *   </div>
 * );
 */

export default function useStateWithHistory<T>(
  defaultValue: T,
  { capacity = 10 }: Options = {}
) {
  const [value, setValue] = useState<T>(defaultValue);
  const historyRef = useRef<T[]>([defaultValue]);
  const pointerRef = useRef<number>(0);

  /**
   * Sets a new state value and updates the history stack.
   * @param {T | ((prevValue: T) => T)} v - The new value or a function to compute the new value based on the previous state.
   */
  const set = useCallback(
    (v: T | ((prevValue: T) => T)) => {
      const resolvedValue =
        typeof v === "function" ? (v as (prevValue: T) => T)(value) : v;

      // Only update if the new value is different from the current value
      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        // Remove future history if we are not at the latest state
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1);
        }

        // Add the new value to the history
        historyRef.current.push(resolvedValue);

        // Trim the history to the specified capacity
        while (historyRef.current.length > capacity) {
          historyRef.current.shift();
        }

        // Update the pointer to the latest state
        pointerRef.current = historyRef.current.length - 1;
      }

      // Update the state
      setValue(resolvedValue);
    },
    [capacity, value]
  );

  // Navigates back to the previous state in the history stack.
  const back = useCallback(() => {
    if (pointerRef.current <= 0) return;
    pointerRef.current--;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  // Navigates forward to the next state in the history stack.
  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return;
    pointerRef.current++;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  // Navigates to a specific index in the history stack.
  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return;
    pointerRef.current = index;
    setValue(historyRef.current[pointerRef.current]);
  }, []);

  return [
    value,
    set,
    {
      /**
       * The history stack of state values.
       */
      history: historyRef.current,
      /**
       * The current pointer position in the history stack.
       */
      pointer: pointerRef.current,
      /**
       * A function to navigate back in the history stack.
       */
      back,
      /**
       * A function to navigate forward in the history stack.
       */
      forward,
      /**
       * A function to navigate to a specific index in the history stack.
       */
      go,
    },
  ] as const;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#7-usestatewithhistory
