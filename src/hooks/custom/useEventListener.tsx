import { useEffect, useRef } from "react"

type EventHandler = (event: Event) => void
type TargetElement = HTMLElement | Window

export default function useEventListener(
  eventType: string,
  callback: EventHandler,
  element: TargetElement | null = window
) {
  const callbackRef = useRef<EventHandler>(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!element) return

    const handler = (event: Event) => callbackRef.current(event)
    element.addEventListener(eventType, handler)

    return () => {
      element.removeEventListener(eventType, handler)
    }
  }, [eventType, element])
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#13-useeventlistener