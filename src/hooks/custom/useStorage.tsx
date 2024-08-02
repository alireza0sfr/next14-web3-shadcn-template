import { useCallback, useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage(key, defaultValue, window.localStorage)
}

export function useSessionStorage<T>(key: string, defaultValue: T | (() => T)) {
  return useStorage(key, defaultValue, window.sessionStorage)
}

function useStorage<T>(
  key: string,
  defaultValue: T | (() => T),
  storageObject: Storage
) {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)

    if (typeof defaultValue === "function") {
      return (defaultValue as () => T)()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    if (value === undefined) {
      storageObject.removeItem(key)
    } else {
      storageObject.setItem(key, JSON.stringify(value))
    }
  }, [key, value, storageObject])

  const remove = useCallback(() => {
    setValue(undefined as unknown as T)
  }, [])

  return [value, setValue, remove] as const
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#8-usestorage