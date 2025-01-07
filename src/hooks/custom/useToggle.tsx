import { useState } from "react";

/**
 * A custom hook to manage a boolean state with toggle functionality.
 *
 * @param {boolean} defaultValue - The initial value of the toggle state.
 * @returns {Array} - An array containing the current toggle value and a function to toggle it.
 *
 * @example
 * const [isOn, toggleIsOn] = useToggle(false);
 *
 * return (
 *   <div>
 *     <p>Toggle State: {isOn ? "ON" : "OFF"}</p>
 *     <button onClick={() => toggleIsOn()}>Toggle</button>
 *     <button onClick={() => toggleIsOn(true)}>Set ON</button>
 *     <button onClick={() => toggleIsOn(false)}>Set OFF</button>
 *   </div>
 * );
 */

export default function useToggle(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue);

  /**
   * Toggles the boolean value or sets it to a specific value.
   * @param {boolean} [newValue] - The new value to set. If not provided, the value will be toggled.
   */
  function toggleValue(newValue?: boolean) {
    setValue((currentValue) =>
      typeof newValue === "boolean" ? newValue : !currentValue
    );
  }

  return [value, toggleValue] as const;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#1-usetoggle
