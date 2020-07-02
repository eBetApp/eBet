// React imports
import React, { useState, useContext, useRef } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
// UI imports
import { Input, Icon, ThemeContext } from "react-native-elements";
import {
  MainKeyboardAvoidingView,
  TextLink,
  ButtonValid,
  Loader,
  BirthdatePicker,
} from "../../components";
import Toast from "react-native-easy-toast";
import { ScrollView } from "react-native-gesture-handler";
// Custom hooks imports
import useInput from "../../hooks/useInput";
// Redux import
import { useStore } from "../../hooks/store";
import { dispatchUserNew } from "../../hooks/dispatchers";
// API types imports
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../../Utils/parseApiError";
// Services import
import { userService } from "../../Services";
// Resources imports
import {
  Strings,
  Navigation,
  setStorage,
  localStorageItems,
} from "../../Resources";

export default function SignUpView({ navigation }) {
  // Theme
  const { theme } = useContext(ThemeContext);

  // Redux
  const { dispatch } = useStore();

  // States
  const useNickname = useInput();
  const useEmail = useInput();
  const usePassword = useInput();
  const [birthdate, setBirthdate] = useState(null);
  const [authIsProcessing, setAuthIsProcessing] = useState<boolean>(false);

  // States: Errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

  // Ref
  const pwdInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const toastErrRef = useRef(null);

  const _submitForm = (): void => {
    if (authIsProcessing) return;
    if (birthdate === null || birthdate === undefined) return;
    setAuthIsProcessing(true);

    const payload = {
      nickname: useNickname.value,
      email: useEmail.value,
      password: usePassword.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    userService
      .signUpAsync(payload)
      .then((result) => {
        if (result === null) {
          return toastErrRef.current.show("Network error");
        } else if ((result as IAuthServiceResponse)?.status === 201) {
          dispatchUserNew(dispatch, (result as IAuthServiceResponse).data.user);
          setStorage(
            localStorageItems.token,
            (result as IAuthServiceResponse).meta.token
          );
          setFormError(new AuthError());
        } else if ((result as IApiResponseError)?.error?.status === 400) {
          switch (
            classifyAuthError((result as IApiResponseError).error.message)
          ) {
            case errorType.nickname:
              setFormError(
                new AuthError({
                  nickname: (result as IApiResponseError).error?.message,
                })
              );
              break;
            case errorType.email:
              setFormError(
                new AuthError({
                  email: (result as IApiResponseError).error?.message,
                })
              );
              break;
            case errorType.password:
              setFormError(
                new AuthError({
                  password: (result as IApiResponseError).error?.message,
                })
              );
              break;
            case errorType.birthdate:
              setFormError(
                new AuthError({
                  birthdate: (result as IApiResponseError).error?.message,
                })
              );
              break;
            default:
              break;
          }
        } else throw new Error();
      })
      .catch((error) => {
        toastErrRef.current.show("Unexpected error");
        console.log("signUpAsync() -- Unexpected error : ", error);
      })
      .finally(() => setAuthIsProcessing(false));
  };

  return (
    <MainKeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={styles.formContainer}>
        <Input
          placeholder={Strings.inputs.ph_nickname}
          {...useNickname}
          errorMessage={formError.nickname}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={emailInputRef}
          placeholder={Strings.inputs.ph_email}
          keyboardType="email-address"
          {...useEmail}
          errorMessage={formError.email}
          returnKeyType="next"
          onSubmitEditing={() => pwdInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={pwdInputRef}
          placeholder={Strings.inputs.ph_password}
          textContentType={"password"}
          secureTextEntry={true}
          {...usePassword}
          errorMessage={formError.password}
        />
        <BirthdatePicker
          handleNewValue={(value) => setBirthdate(value)}
          errorMessage={formError.birthdate}
          placeholder={Strings.inputs.ph_birthdate}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title={Strings.buttons.signup}
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
        <TouchableOpacity
          onPress={() => navigation.navigate(Navigation.Screens.signIn)}
        >
          <TextLink style={{ color: "blue" }}>
            {Strings.textLinks.go_sign_in}
          </TextLink>
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
