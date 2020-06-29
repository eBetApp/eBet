import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// UI imports
import {
  Button,
  Input,
  Icon,
  ThemeConsumer,
  Text,
} from "react-native-elements";
import { ThemeContext } from "react-native-elements";
import { ButtonValid, ButtonCancel } from "../components/styled/Buttons";
import { TextLink } from "../components/styled/TextLink";
import { MainView, MainKeyboardAvoidingView } from "../components/styled/Views";

// Fetch imports
import userService from "../Services/userService";

// Custom hooks imports
import useInput from "../hooks/useInput";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNew } from "../hooks/dispatchers";

// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";

// utils imports
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../Utils/parseApiError";

// LocalStorage imports
import { setStorage } from "../Utils/asyncStorage";

// Navigation imports
import { Screens } from "../Resources/Navigation";

export default function SignInView({ navigation }) {
  const { theme } = useContext(ThemeContext);
  const { state, dispatch } = useStore();
  const useEmail = useInput();
  const usePassword = useInput();

  const [formError, setFormError] = useState<AuthError>(new AuthError());

  const _submitForm = (): void => {
    const payload = {
      email: useEmail.value,
      password: usePassword.value,
    };

    userService
      .signInAsync(payload)
      .then((result) => {
        if (result.status === 200) {
          dispatchUserNew(dispatch, result.data.user);
          setStorage("token", result.meta.token);
          navigation.navigate(Screens.loggedHome);
        } else if (result.error?.status === 400) {
          switch (classifyAuthError(result.error.message)) {
            case errorType.email:
              setFormError(new AuthError({ email: result.error.message }));
              break;
            case errorType.password:
              setFormError(new AuthError({ password: result.error.message }));
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
    <MainKeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Input
          placeholder="Email"
          keyboardType="email-address"
          {...useEmail}
          errorMessage={formError.email}
        />
        <Input
          placeholder="Password"
          textContentType={"password"}
          secureTextEntry={true}
          {...usePassword}
          errorMessage={formError.password}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title="SIGN IN"
          onPress={_submitForm}
          icon={
            <Icon
              name="ios-checkmark"
              type="ionicon"
              style={{ marginRight: 5 }}
            />
          }
        />
        <TouchableOpacity onPress={() => navigation.navigate(Screens.signUp)}>
          <TextLink>New to eBet? Go to REGISTER!!</TextLink>
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
