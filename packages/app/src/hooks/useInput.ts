import { useState } from "react";
import { TextInputChangeEventData, NativeSyntheticEvent } from "react-native";

export default function useInput(initialState = "") {
  const [value, setValue] = useState(initialState);
  return {
    value,
    onChangeText(text: string) {
      setValue(text);
    },
  };
}
