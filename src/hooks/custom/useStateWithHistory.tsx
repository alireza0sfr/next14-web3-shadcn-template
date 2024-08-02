import { useCallback, useRef, useState } from "react"

interface Options {
  capacity?: number
}

export default function useStateWithHistory<T>(
  defaultValue: T,
  { capacity = 10 }: Options = {}
) {
  const [value, setValue] = useState<T>(defaultValue)
  const historyRef = useRef<T[]>([defaultValue])
  const pointerRef = useRef<number>(0)

  const set = useCallback(
    (v: T | ((prevValue: T) => T)) => {
      const resolvedValue = typeof v === "function" ? (v as (prevValue: T) => T)(value) : v
      if (historyRef.current[pointerRef.current] !== resolvedValue) {
        if (pointerRef.current < historyRef.current.length - 1) {
          historyRef.current.splice(pointerRef.current + 1)
        }
        historyRef.current.push(resolvedValue)

        while (historyRef.current.length > capacity) {
          historyRef.current.shift()
        }
        pointerRef.current = historyRef.current.length - 1
      }
      setValue(resolvedValue)
    },
    [capacity, value]
  )

  const back = useCallback(() => {
    if (pointerRef.current <= 0) return
    pointerRef.current--
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const forward = useCallback(() => {
    if (pointerRef.current >= historyRef.current.length - 1) return
    pointerRef.current++
    setValue(historyRef.current[pointerRef.current])
  }, [])

  const go = useCallback((index: number) => {
    if (index < 0 || index > historyRef.current.length - 1) return
    pointerRef.current = index
    setValue(historyRef.current[pointerRef.current])
  }, [])

  return [
    value,
    set,
    {
      history: historyRef.current,
      pointer: pointerRef.current,
      back,
      forward,
      go,
    },
  ] as const
}


// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#7-usestatewithhistory