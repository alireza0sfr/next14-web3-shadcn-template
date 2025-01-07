import { useCallback, useEffect, useRef } from "react";
import type { Callback } from "~/types/hooks/general";

/**
 * A custom hook to manage a timeout with the ability to reset or clear it.
 *
 * @param {Callback} callback - The function to execute after the timeout delay.
 * @param {number} delay - The delay in milliseconds before the callback is executed.
 * @returns {Object} - An object containing functions to reset and clear the timeout.
 *
 * @example
 * const { reset, clear } = useTimeout(() => {
 *   console.log("Timeout completed!");
 * }, 3000);
 *
 * return (
 *   <div>
 *     <button onClick={reset}>Reset Timeout</button>
 *     <button onClick={clear}>Clear Timeout</button>
 *   </div>
 * );
 */

export default function useTimeout(callback: Callback, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update the callback ref when the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  /**
   * Sets the timeout with the specified delay.
   */
  const set = useCallback(() => {
    timeoutRef.current = setTimeout(() => callbackRef.current(), delay);
  }, [delay]);

  /**
   * Clears the timeout if it is active.
   */
  const clear = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  // Set the timeout on mount and clear it on unmount
  useEffect(() => {
    set();
    return clear;
  }, [delay, set, clear]);

  /**
   * Resets the timeout by clearing it and setting it again.
   */
  const reset = useCallback(() => {
    clear();
    set();
  }, [clear, set]);

  return {
    /**
     * A function to reset the timeout.
     */
    reset,
    /**
     * A function to clear the timeout.
     */
    clear,
  };
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#2-usetimeout
