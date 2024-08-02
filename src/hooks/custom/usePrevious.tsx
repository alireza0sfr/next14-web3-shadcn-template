import { useRef } from "react"

export default function usePrevious<T>(value: T) {
  const currentRef = useRef<T>(value)
  const previousRef = useRef<T>()

  if (currentRef.current !== value) {
    previousRef.current = currentRef.current
    currentRef.current = value
  }

  return previousRef.current
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#6-useprevious