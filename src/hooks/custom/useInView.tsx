import { useState, useEffect, useRef, RefObject } from "react";

interface IProps {
  /**
   * The threshold value for the intersection. Default is 0.1.
   * @type {number}
   */
  threshold?: number;

  /**
   * Whether to observe the element only once. Default is false.
   * @type {boolean}
   */
  once?: boolean;

  /**
   * Optional ref to use for observing the element.
   * @type {React.RefObject<HTMLElement>}
   */
  ref?: RefObject<HTMLElement>;

  /**
   * Whether the intersection observer should be enabled. Default is true.
   * @type {boolean}
   */
  enabled?: boolean;
}

/**
 * Custom hook to detect if an element is in the viewport using Intersection Observer.
 *
 * @param {Object} options - Options for the Intersection Observer.
 * @param {number} options.threshold - The threshold value for the intersection. Default is 0.1.
 * @param {boolean} options.once - Whether to observe the element only once. Default is false.
 * @param {React.RefObject<HTMLElement>} options.ref - Optional ref to use for observing the element.
 * @param {boolean} options.enabled - Whether the intersection observer should be enabled. Default is true.
 * @returns {Object} - An object containing the ref to attach to the element and the isInView state.
 *
 * @example
 * const { ref, isInView } = useInView({ threshold: 0.5, once: true });
 *
 * return (
 *   <div ref={ref}>
 *     {isInView ? "Element is in view!" : "Scroll to see the element"}
 *   </div>
 * );
 */

const useInView = ({
  threshold = 0.1,
  once = false,
  ref: customRef,
  enabled = true,
}: IProps) => {
  const [isInView, setIsInView] = useState(false);
  const internalRef = useRef<HTMLElement>(null);

  const targetRef = customRef || internalRef;

  useEffect(() => {
    if (!enabled) {
      // If not enabled, set isInView to false and return
      setIsInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update isInView state based on intersection
        setIsInView(entry.isIntersecting);

        // If observing only once and the element is in view, unobserve it
        if (once && entry.isIntersecting) {
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    // Start observing the target element
    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    // Cleanup function to unobserve the target element
    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [threshold, once, targetRef, enabled]);

  return {
    /**
     * The ref to attach to the element being observed.
     */
    ref: targetRef as RefObject<HTMLDivElement>,
    /**
     * Indicates whether the element is currently in the viewport.
     */
    isInView,
  };
};

export default useInView;
