import { useEffect } from "react"
import useTimeout from "./useTimeout"
import type { Callback } from '~/types/hooks/general'

export default function useDebounce(callback: Callback, delay: number, dependencies: React.DependencyList) {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [])
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#3-usedebounce