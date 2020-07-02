import React, { useState, useContext, useRef } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
// UI imports
import { Input, Icon, ThemeContext } from "react-native-elements";
import {
  ButtonValid,
  TextLink,
  MainKeyboardAvoidingView,
  Loader,
  ToastErr,
} from "../../components";
// Fetch imports
import { userService } from "../../Services";
// Custom hooks imports
import useInput from "../../Hooks/useInput";
// Redux import
import { useStore } from "../../Redux/store";
import { dispatchUserNew } from "../../Redux/dispatchers";
// utils imports
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../../Utils/parseApiError";
// Resources imports
import {
  Strings,
  Navigation,
  setStorage,
  localStorageItems,
} from "../../Resources";

export default function SignInView({ navigation }) {
  // Redux
  const { dispatch } = useStore();

  // States
  const useEmail = useInput();
  const usePassword = useInput();
  const [authIsProcessing, setAuthIsProcessing] = useState<boolean>(false);

  // States: Errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

  // Ref
  const pwdInputRef = useRef(null);
  const toastErrRef = useRef(null);

  //#region FETCH TO SIGN IN
  const submitForm = () => {
    _fetch();
  };

  const _fetch = () => {
    if (authIsProcessing) return;
    setAuthIsProcessing(true);

    const payload: ISignInPayload = {
      email: useEmail.value,
      password: usePassword.value,
    };

    userService
      .signInAsync(payload)
      .then((result) => _handleFetchRes(result))
      .catch((error) => _handleFetchErr(error))
      .finally(() => setAuthIsProcessing(false));
  };

  const _handleFetchRes = (result: ApiResponse) => {
    if (result === null) {
      setFormError(new AuthError());
      toastErrRef.current.show("Network error");
      return;
    } else if ((result as IAuthServiceResponse)?.status === 200) {
      dispatchUserNew(dispatch, (result as IAuthServiceResponse).data.user);
      setStorage(
        localStorageItems.token,
        (result as IAuthServiceResponse).meta.token
      );
      setFormError(new AuthError());
      navigation.navigate(Navigation.Screens.loggedHome);
    } else if ((result as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((result as IApiResponseError).error.message)) {
        case errorType.email:
          setFormError(
            new AuthError({
              email: (result as IApiResponseError).error.message,
            })
          );
          break;
        case errorType.password:
          setFormError(
            new AuthError({
              password: (result as IApiResponseError).error.message,
            })
          );
          break;
        default:
          break;
      }
    } else throw new Error();
  };

  const _handleFetchErr = (error: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("signInAsync() -- Unexpected error : ", error);
  };
  //#endregion FETCH TO SIGN IN

  //#region VIEW
  return (
    <MainKeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Input
          placeholder={Strings.inputs.ph_email}
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
          placeholder={Strings.inputs.ph_password}
          textContentType={"password"}
          secureTextEntry={true}
          {...usePassword}
          errorMessage={formError.password}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title={Strings.buttons.signin}
          onPress={submitForm}
          icon={
            <Icon
              name="ios-checkmark"
              type="ionicon"
              style={{ marginRight: 5 }}
            />
          }
        />
        <Loader animating={authIsProcessing} />
        <TextLink
          text={Strings.textLinks.go_register}
          onPress={() => navigation.navigate(Navigation.Screens.signUp)}
        />
      </View>
      <ToastErr setRef={toastErrRef} position="top" />
    </MainKeyboardAvoidingView>
  );
  //#endregion VIEW
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
