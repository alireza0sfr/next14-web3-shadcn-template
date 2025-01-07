import { useEffect, useState, RefObject } from "react";

/**
 * Custom hook to detect if an element is visible on the screen using Intersection Observer.
 *
 * @param {RefObject<HTMLElement>} ref - The ref of the element to observe.
 * @param {string} [rootMargin="0px"] - The root margin for the Intersection Observer.
 * @returns {boolean} - Whether the element is currently visible on the screen.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * const isVisible = useOnScreen(ref, "100px");
 *
 * return (
 *   <div ref={ref}>
 *     {isVisible ? "Element is visible!" : "Scroll to see the element"}
 *   </div>
 * );
 */

export default function useOnScreen(
  ref: RefObject<HTMLElement>,
  rootMargin = "0px"
) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (ref.current == null) return;

    // Create an Intersection Observer to detect visibility
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { rootMargin }
    );

    // Start observing the element
    observer.observe(ref.current);

    // Cleanup function to unobserve the element
    return () => {
      if (ref.current == null) return;
      observer.unobserve(ref.current);
    };
  }, [ref.current, rootMargin]);

  return isVisible;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#14-useonscreen
