// React imports
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";

// UI imports
import { Button, Input, Icon } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

// Fetch imports
import queryString from "query-string";

// Custom hooks imports
import useInput from "../hooks/useInput";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchNewUser } from "../hooks/dispatchers";

// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";

// API types imports
import { classifyError, errorType } from "../Utils/parseApiError";

// LocalStorage imports
import { setStorage } from "../Utils/asyncStorage";

export default function SignUpView({ navigation }) {
  const { dispatch } = useStore();
  const useNickname = useInput();
  const useEmail = useInput();
  const usePassword = useInput();
  const [birthdate, setBirthdate] = useState("");
  const [errorNickname, setErrorNickname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorBirthdate, setErrorBirthdate] = useState("");
  const date = new Date(Date.now());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setBirthdate(selectedDate.toDateString());
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const _submitForm = () => {
    const myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const payload = {
      nickname: useEmail.value,
      email: useEmail.value,
      password: usePassword.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: queryString.stringify(payload),
    };

    fetch(`${REACT_NATIVE_BACK_URL}/api/auth/signup`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status === 201) {
          dispatchNewUser(dispatch, result.data.user);
          setStorage("token", result.meta.token);
          navigation.navigate("Home");
        } else if (result.error?.status === 400) {
          switch (classifyError(result.error.message)) {
            case errorType.nickname:
              setErrorNickname(result.error?.message);
              break;
            case errorType.email:
              setErrorEmail(result.error?.message);
              break;
            case errorType.password:
              setErrorPassword(result.error?.message);
              break;
            case errorType.birthdate:
              setErrorBirthdate(result.error?.message);
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
        placeholder="Nickname"
        {...useNickname}
        errorMessage={errorNickname}
      />
      <Input
        placeholder="Email"
        keyboardType="email-address"
        {...useEmail}
        errorMessage={errorEmail}
      />
      <TouchableOpacity onPress={showDatepicker}>
        <Input
          editable={false}
          placeholder="Birthdate"
          value={birthdate}
          errorMessage={errorBirthdate}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
      <Input
        placeholder="Password"
        secureTextEntry={true}
        {...usePassword}
        errorMessage={errorPassword}
      />
      <Button
        title="SIGN UP"
        onPress={_submitForm}
        icon={<Icon name="ios-checkmark" type="ionicon" color="#ffffff" />}
      />
      <TouchableOpacity onPress={() => navigation.navigate("signin")}>
        <Text style={{ color: "blue" }}>Already have an account? SIGN IN</Text>
      </TouchableOpacity>
    </View>
  );
}
