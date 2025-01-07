import { useEffect, useRef } from "react";
import { Callback } from "~/types/hooks/general";

/**
 * A custom hook that mimics the behavior of `useEffect`, but only runs the effect after the first render.
 *
 * @param {Callback} callback - The function to execute after the first render.
 * @param {React.DependencyList} dependencies - The dependencies that trigger the effect.
 *
 * @example
 * useUpdateEffect(() => {
 *   console.log("This will run after the first render");
 * }, [someDependency]);
 *
 * return (
 *   <div>
 *     <p>Check the console for the effect output.</p>
 *   </div>
 * );
 */

export default function useUpdateEffect(
  callback: Callback,
  dependencies: React.DependencyList
) {
  const firstRenderRef = useRef(true);

  useEffect(() => {
    // Skip the first render
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    // Execute the callback after the first render
    return callback();
  }, dependencies);
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#4-useupdateeffect
