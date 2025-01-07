import { useEffect, useState, useCallback } from "react";

/**
 * A custom React hook to manage the state and lifecycle of a component with animated mounting and unmounting.
 *
 * @function
 * @name useAnimatedUnmount
 * @param {boolean} [initialShouldRender=false] - Indicates whether the component should be initially rendered.
 * @param {number} [mountDelay=50] - The delay in milliseconds before applying the mount animation.
 * @param {number} [unmountDelay=300] - The delay in milliseconds before unmounting the component.
 * @returns {Object} An object containing the state and functions to manage the component.
 * @property {boolean} isVisible - Indicates whether the component should be visible (for animation purposes).
 * @property {boolean} shouldRender - Indicates whether the component should be in the DOM.
 * @property {function} setMounted - A function to set the state of whether the component should be rendered and visible.
 *
 * @example
 * const { isVisible, shouldRender, setMounted } = useAnimatedUnmount(false);
 *
 * return (
 *   <>
 *     <button onClick={() => setMounted(true)}>Open Component</button>
 *     {shouldRender && (
 *       <MyComponent
 *         className={`transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
 *         onClose={() => setMounted(false)}
 *       />
 *     )}
 *   </>
 * );
 */
const useAnimatedUnmount = (
  initialShouldRender: boolean = false,
  mountDelay: number = 50,
  unmountDelay: number = 300
) => {
  const [isVisible, setIsVisible] = useState(initialShouldRender);
  const [shouldRender, setShouldRender] = useState(initialShouldRender);

  /**
   * A function to set the state of whether the component should be rendered and visible.
   */
  const setMounted = useCallback(
    (value: boolean) => {
      if (value) {
        setShouldRender(true);
        setTimeout(() => setIsVisible(true), mountDelay);
      } else {
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), unmountDelay);
      }
    },
    [mountDelay, unmountDelay]
  );

  useEffect(() => {
    setMounted(initialShouldRender);
  }, [initialShouldRender, setMounted]);

  return {
    /**
     * Indicates whether the component should be visible (for animation purposes).
     */
    isVisible,

    /**
     * Indicates whether the component should be in the DOM.
     */
    shouldRender,

    /**
     * A function to set the state of whether the component should be rendered and visible.
     */
    setMounted,
  };
};

export default useAnimatedUnmount;
