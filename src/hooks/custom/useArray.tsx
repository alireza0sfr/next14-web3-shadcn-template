import { useState } from "react";

/**
 * A custom React hook to manage an array state and provide utility functions for common array operations.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} defaultValue - The initial value of the array.
 *
 * @example
 * const { array, set, push, filter, update, remove, clear } = useArray([1, 2, 3]);
 *
 * return (
 *   <div>
 *     <ul>
 *       {array.map((item, index) => (
 *         <li key={index}>{item}</li>
 *       ))}
 *     </ul>
 *     <button onClick={() => push(4)}>Add 4</button>
 *     <button onClick={() => filter((item) => item > 2)}>Filter items > 2</button>
 *     <button onClick={() => update(1, 10)}>Update index 1 to 10</button>
 *     <button onClick={() => remove(1)}>Remove item at index 1</button>
 *     <button onClick={clear}>Clear array</button>
 *   </div>
 * );
 */

export default function useArray<T>(defaultValue: T[]) {
  const [array, setArray] = useState<T[]>(defaultValue);

  // Adds an element to the end of the array.
  function push(element: T) {
    setArray((a) => [...a, element]);
  }

  // Filters the array based on a callback function.
  function filter(callback: (value: T, index: number, array: T[]) => boolean) {
    setArray((a) => a.filter(callback));
  }

  // Updates an element at a specific index in the array.
  function update(index: number, newElement: T) {
    setArray((a) => [
      ...a.slice(0, index),
      newElement,
      ...a.slice(index + 1, a.length),
    ]);
  }

  // Removes an element at a specific index from the array.
  function remove(index: number) {
    setArray((a) => [...a.slice(0, index), ...a.slice(index + 1, a.length)]);
  }

  // Clears the array, setting it to an empty array.
  function clear() {
    setArray([]);
  }

  return {
    /**
     * The current array state.
     */
    array,
    /**
     * A function to set the entire array.
     */
    set: setArray,
    /**
     * A function to add an element to the end of the array.
     */
    push,
    /**
     * A function to filter the array based on a callback function.
     */
    filter,
    /**
     * A function to update an element at a specific index in the array.
     */
    update,
    /**
     * A function to remove an element at a specific index from the array.
     */
    remove,
    /**
     * A function to clear the array, setting it to an empty array.
     */
    clear,
  };
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#5-usearray
