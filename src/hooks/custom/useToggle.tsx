import { useState } from "react"

export default function useToggle(defaultValue: boolean) {
  const [value, setValue] = useState(defaultValue)

  function toggleValue(value: boolean) {
    setValue(currentValue =>
      typeof value === "boolean" ? value : !currentValue
    )
  }

  return [value, toggleValue]
}

// https://dev.to/arafat4693/15-useful-react-custom-hooks-that-you-can-use-in-any-project-2ll8#1-usetoggle