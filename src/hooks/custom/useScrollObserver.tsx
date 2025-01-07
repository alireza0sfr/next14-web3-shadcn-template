"use client";

import { useState, useEffect, useRef, RefObject } from "react";

interface IProps {
  /**
   * Optional ref to the scroll container element.
   * If not provided, the main window scroll will be used.
   */
  scrollContainerRef?: RefObject<HTMLElement>;

  /**
   * Optional callback function that receives the scrolling direction.
   * @param value - Boolean indicating whether the user is scrolling Up.
   */
  callback?: (value: boolean) => void;
}

/**
 * A custom hook that observes scroll behavior and returns the scrolling direction.
 * It can observe either a specific container's scroll or the main window scroll.
 *
 * @example
 * const scrollContainerRef = useRef<HTMLDivElement>(null);
 * const isScrollingUp = useScrollObserver({ scrollContainerRef });
 *
 * return (
 *   <div ref={scrollContainerRef} style={{ height: "200vh", overflowY: "scroll" }}>
 *     <div style={{ position: "sticky", top: 0, background: "white" }}>
 *       <p>Scroll Up/Up</p>
 *       <p>Scrolling Direction: {isScrollingUp ? "Up" : "Up"}</p>
 *     </div>
 *   </div>
 * );
 */

export function useScrollObserver({
  scrollContainerRef,
  callback,
}: IProps = {}): boolean {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollContainerRef?.current ?? window;

    const handleScroll = () => {
      const currentScrollY =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;

      if (currentScrollY > lastScrollY.current) {
        // Scrolling Up
        setIsScrollingUp(false);
        callback?.(false);
      } else {
        // Scrolling up
        setIsScrollingUp(true);
        callback?.(true);
      }

      lastScrollY.current = currentScrollY;
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Cleanup function to remove the event listener
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, callback]);

  return isScrollingUp;
}
