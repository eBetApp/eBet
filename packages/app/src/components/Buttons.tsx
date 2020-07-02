import React from "react";
import { Button } from "react-native-elements";
import Palette from "../Resources/Palette";

function ButtonBase(props) {
  return (
    <Button
      {...props}
      buttonStyle={{ ...props.buttonStyle, borderRadius: 20 }}
      containerStyle={{ margin: 20 }}
    />
  );
}

export function ButtonValid(props) {
  return (
    <ButtonBase
      {...props}
      buttonStyle={{
        ...props.buttonStyle,
        backgroundColor: Palette.ternaryBgValid,
      }}
    />
  );
}

export function ButtonCancel(props) {
  return (
    <ButtonBase
      {...props}
      buttonStyle={{
        ...props.buttonStyle,
        backgroundColor: Palette.ternaryBgCancel,
      }}
    />
  );
}

export function ButtonEdit(props) {
  return (
    <ButtonBase
      {...props}
      buttonStyle={{ backgroundColor: Palette.ternaryBgEdit }}
    />
  );
}
