import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// UI imports
import { Button, Input, Icon } from "react-native-elements";

// Fetch imports
import queryString from "query-string";

// Custom hooks imports
import useInput from "../hooks/useInput";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNew } from "../hooks/dispatchers";

// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";

// Services import
import userService from "../Services/userService";

// utils imports
import { classifyError, errorType } from "../Utils/parseApiError";

// LocalStorage imports
import { setStorage } from "../Utils/asyncStorage";

export default function SignInView({ navigation }) {
  const { state, dispatch } = useStore();
  const useEmail = useInput();
  const usePassword = useInput();
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

  const _submitForm = () => {
    const payload = {
      email: useEmail.value,
      password: usePassword.value,
    };

    userService
      .signInAsync(payload)
      .then((result) => {
        console.log("RESULT");
        console.log(result);
        if (result.status === 200) {
          dispatchUserNew(dispatch, result.data.user);
          setStorage("token", result.meta.token);
          navigation.navigate("Home");
        } else if (result.error?.status === 400) {
          switch (classifyError(result.error.message)) {
            case errorType.email:
              setErrorEmail(result.error?.message);
              break;
            case errorType.password:
              setErrorPassword(result.error?.message);
              break;
            default:
              break;
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <View>
      <Input
        placeholder="Email"
        keyboardType="email-address"
        {...useEmail}
        errorMessage={errorEmail}
      />
      <Input
        placeholder="Password"
        secureTextEntry={true}
        {...usePassword}
        errorMessage={errorPassword}
      />
      <Button
        title="SIGN IN"
        onPress={_submitForm}
        icon={<Icon name="ios-checkmark" type="ionicon" color="#ffffff" />}
      />
      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text style={{ color: "blue" }}>Already have an account? SIGN UP</Text>
      </TouchableOpacity>
    </View>
  );
}
