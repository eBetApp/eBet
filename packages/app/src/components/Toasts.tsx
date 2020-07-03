import React, { MutableRefObject, useContext } from "react";
import Toast from "react-native-easy-toast";
// UI imports
import { ThemeContext } from "react-native-elements";

interface IProps {
  setRef: MutableRefObject<any>;
}

export function ToastErr(props: IProps) {
  // Theme
  const { theme } = useContext(ThemeContext);

  return (
    <Toast
      {...props}
      ref={props.setRef}
      style={{ borderRadius: 20 }}
      textStyle={{ color: theme.colors.error }}
    />
  );
}

export function ToastSuccess(props: IProps) {
  // Theme
  const { theme } = useContext(ThemeContext);

  return (
    <Toast
      {...props}
      ref={props.setRef}
      style={{ borderRadius: 20 }}
      textStyle={{ color: theme.colors.primary }}
    />
  );
}
