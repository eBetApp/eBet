import { useState } from "react";

export function useInput(initialState = "") {
  const [value, setValue] = useState(initialState);
  return {
    value,
    onChangeText(text: string) {
      setValue(text);
    },
  };
}
