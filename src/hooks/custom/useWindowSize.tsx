import { useState } from "react";

import useEventListener from "./useEventListener";

/**
 * A custom hook to track the current window size (width and height).
 *
 * @example
 * const { width, height } = useWindowSize();
 *
 * return (
 *   <div>
 *     <p>Window Width: {width}px</p>
 *     <p>Window Height: {height}px</p>
 *   </div>
 * );
 */

export default function useWindowSize(): object {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Listen for window resize events and update the state
  useEventListener("resize", () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  });

  return windowSize;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#15-usewindowsize
