import { useCallback, useState, useEffect } from "react";

/**
 * A custom hook to manage state in local storage.
 *
 * @template T - The type of the value to store.
 * @param {string} key - The key to use for storing the value in local storage.
 * @param {T | (() => T)} defaultValue - The default value or a function to compute the default value.
 * @returns {Array} - An array containing the current value, a state setter function, and a function to remove the value from storage.
 *
 * @example
 * const [name, setName, removeName] = useLocalStorage<string>("name", "John");
 *
 * return (
 *   <div>
 *     <p>Current Name: {name}</p>
 *     <input
 *       type="text"
 *       value={name}
 *       onChange={(e) => setName(e.target.value)}
 *     />
 *     <button onClick={removeName}>Remove Name</button>
 *   </div>
 * );
 */
export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage(key, defaultValue, window.localStorage);
}

/**
 * A custom hook to manage state in session storage.
 *
 * @template T - The type of the value to store.
 * @param {string} key - The key to use for storing the value in session storage.
 * @param {T | (() => T)} defaultValue - The default value or a function to compute the default value.
 * @returns {Array} - An array containing the current value, a state setter function, and a function to remove the value from storage.
 *
 * @example
 * const [token, setToken, removeToken] = useSessionStorage<string>("token", "");
 *
 * return (
 *   <div>
 *     <p>Current Token: {token}</p>
 *     <input
 *       type="text"
 *       value={token}
 *       onChange={(e) => setToken(e.target.value)}
 *     />
 *     <button onClick={removeToken}>Remove Token</button>
 *   </div>
 * );
 */

export function useSessionStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

function useStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  storageObject: Storage
) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue);

    if (typeof defaultValue === "function") {
      return (defaultValue as () => T)();
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (value === undefined) {
      storageObject.removeItem(key);
    } else {
      storageObject.setItem(key, JSON.stringify(value));
    }
  }, [key, value, storageObject]);

  const remove = useCallback(() => {
    setValue(undefined as unknown as T);
  }, []);

  return [value, setValue, remove] as const;
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#8-usestorage
