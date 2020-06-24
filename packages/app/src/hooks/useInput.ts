import { useState } from "react";
import { TextInputChangeEventData, NativeSyntheticEvent } from "react-native";

export default function useInput(initialState = "") {
  const [value, setValue] = useState(initialState);
  return {
    value,
    onChange(event: NativeSyntheticEvent<TextInputChangeEventData>) {
      setValue(event.nativeEvent.text);
    },
  };
}
