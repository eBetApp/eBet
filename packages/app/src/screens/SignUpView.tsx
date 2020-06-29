// React imports
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";

// UI imports
import { Button, Input, Icon, Text } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ButtonValid, ButtonCancel } from "../components/styled/Buttons";
import { ThemeContext } from "react-native-elements";
import { TextLink } from "../components/styled/TextLink";
import { MainView, MainKeyboardAvoidingView } from "../components/styled/Views";

// Fetch imports
import queryString from "query-string";

// Custom hooks imports
import useInput from "../hooks/useInput";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNew } from "../hooks/dispatchers";

// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";

// API types imports
import { classifyError, errorType } from "../Utils/parseApiError";

// LocalStorage imports
import { setStorage } from "../Utils/asyncStorage";

// Services import
import userService from "../Services/userService";

// Navigation imports
import { Screens } from "../Resources/Navigation";
import { ScrollView } from "react-native-gesture-handler";

export default function SignUpView({ navigation }) {
  const { theme } = useContext(ThemeContext);
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
    const payload = {
      nickname: useEmail.value,
      email: useEmail.value,
      password: usePassword.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    userService
      .signUpAsync(payload)
      .then((result) => {
        if (result.status === 201) {
          dispatchUserNew(dispatch, result.data.user);
          setStorage("token", result.meta.token);
          navigation.navigate(Screens.account);
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
    <MainKeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={styles.formContainer}>
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
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title="SIGN UP"
          onPress={_submitForm}
          icon={
            <Icon
              name="ios-checkmark"
              type="ionicon"
              style={{ marginRight: 5 }}
            />
          }
        />
        <TouchableOpacity onPress={() => navigation.navigate(Screens.signIn)}>
          <TextLink style={{ color: "blue" }}>
            Already have an account? Go to SIGN IN
          </TextLink>
        </TouchableOpacity>
      </View>
    </MainKeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    alignSelf: "stretch",
  },
  bottomContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
