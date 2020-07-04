import { useState } from "react";

export interface IForm {
  valid: boolean;
  values: any;
  status: any;
}

export function useFormInput(initialState = null) {
  const [data, setData] = useState<IForm>(initialState);
  return {
    data,
    onChange(value: IForm) {
      setData(value);
    },
  };
}
