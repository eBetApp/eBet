import React, { useState, useContext, useRef, useEffect } from "react";
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
import { Loader } from "../components/styled/Loader";

// Fetch imports
import userService from "../Services/userService";

// Custom hooks imports
import useInput from "../hooks/useInput";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNew } from "../hooks/dispatchers";

// utils imports
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../Utils/parseApiError";

// LocalStorage imports
import { setStorage } from "../Utils/asyncStorage";

// Navigation imports
import { Screens } from "../Resources/NavigationStacks";

// Toast import
import Toast, { DURATION } from "react-native-easy-toast";

export default function SignInView({ navigation }) {
  // Theme
  const { theme } = useContext(ThemeContext);

  // Redux
  const { state, dispatch } = useStore();

  // States
  const useEmail = useInput();
  const usePassword = useInput();
  const [authIsProcessing, setAuthIsProcessing] = useState<boolean>(false);

  // States: Errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

  // Ref
  const pwdInputRef = useRef(null);
  const toastErrRef = useRef(null);

  const _submitForm = () => {
    if (authIsProcessing) return;
    setAuthIsProcessing(true);

    const payload = {
      email: useEmail.value,
      password: usePassword.value,
    };

    userService
      .signInAsync(payload)
      .then((result) => {
        if (result === null) {
          toastErrRef.current.show("Network error");
          return;
        } else if (result?.status === 200) {
          dispatchUserNew(dispatch, result.data.user);
          setStorage("token", result.meta.token);
          navigation.navigate(Screens.loggedHome);
        } else if (result?.error?.status === 400) {
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
        } else throw new Error();
      })
      .catch((error) => {
        toastErrRef.current.show("Unexpected error");
        console.log("signInAsync() -- Unexpected error : ", error);
      })
      .finally(() => setAuthIsProcessing(false));
  };

  return (
    <MainKeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Input
          placeholder="Email"
          keyboardType="email-address"
          {...useEmail}
          errorMessage={formError.email}
          returnKeyType="next"
          onSubmitEditing={() => {
            pwdInputRef.current.focus();
          }}
          blurOnSubmit={false}
        />
        <Input
          ref={pwdInputRef}
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
        <Loader animating={authIsProcessing} />
        <TouchableOpacity onPress={() => navigation.navigate(Screens.signUp)}>
          <TextLink>New to eBet? Go to REGISTER!!</TextLink>
        </TouchableOpacity>
      </View>
      <Toast
        ref={toastErrRef}
        position="top"
        style={{ borderRadius: 20 }}
        textStyle={{ color: theme.colors.error }}
      />
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
