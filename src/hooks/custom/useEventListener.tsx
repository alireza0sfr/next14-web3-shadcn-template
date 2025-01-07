import { useEffect, useRef } from "react";

/**
 * The type for an event handler function.
 */
type EventHandler = (event: Event) => void;

/**
 * The type for the target element on which the event listener is attached.
 */
type TargetElement = HTMLElement | Window;

/**
 * A custom React hook to attach an event listener to a target element and manage its lifecycle.
 *
 * @param {string} eventType - The type of event to listen for (e.g., "click", "keydown").
 * @param {EventHandler} callback - The callback function to execute when the event occurs.
 * @param {TargetElement | null} [element=window] - The target element to attach the event listener to. Defaults to `window`.
 *
 * @example
 * useEventListener("click", (event) => {
 *   console.log("Click event:", event);
 * });
 *
 * return (
 *   <button>Click Me</button>
 * );
 */

export default function useEventListener(
  eventType: string,
  callback: EventHandler,
  element: TargetElement | null = window
) {
  const callbackRef = useRef<EventHandler>(callback);

  // Update the callback ref whenever the callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Attach and detach the event listener
  useEffect(() => {
    if (!element) return;

    // Create a handler that calls the current callback ref
    const handler = (event: Event) => callbackRef.current(event);
    element.addEventListener(eventType, handler);

    // Cleanup function to remove the event listener
    return () => {
      element.removeEventListener(eventType, handler);
    };
  }, [eventType, element]);
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#13-useeventlistener
