import { useEffect, useRef } from "react"
import { Callback } from '~/types/hooks/general'

export default function useUpdateEffect(callback: Callback, dependencies: React.DependencyList) {
  const firstRenderRef = useRef(true)

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }
    return callback()
  }, dependencies)
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#4-useupdateeffect