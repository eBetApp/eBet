import { useState } from "react";

export default function useInput(initialState = "") {
  const [value, setValue] = useState(initialState);
  return {
    value,
    onChange(event: React.ChangeEvent<HTMLInputElement>) {
      setValue(event.target.value);
    },
  };
}
