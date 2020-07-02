import React, { useRef } from "react";
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
import { useInput, useFetchAuth } from "../../Hooks";
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

  // Ref
  const pwdInputRef = useRef(null);
  const toastErrRef = useRef(null);

  //#region FETCH TO SIGN IN
  const payload: ISignInPayload = {
    email: useEmail.value,
    password: usePassword.value,
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => true,
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _fetchRequest = (setErr) => userService.signInAsync(payload);

  const _handleFetchRes = (result: ApiResponse, setError) => {
    if (result === null) {
      setError(new AuthError());
      toastErrRef.current.show("Network error");
      return;
    } else if ((result as IAuthServiceResponse)?.status === 200) {
      dispatchUserNew(dispatch, (result as IAuthServiceResponse).data.user);
      setStorage(
        localStorageItems.token,
        (result as IAuthServiceResponse).meta.token
      );
      setError(new AuthError());
      navigation.navigate(Navigation.Screens.loggedHome);
    } else if ((result as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((result as IApiResponseError).error.message)) {
        case errorType.email:
          setError(
            new AuthError({
              email: (result as IApiResponseError).error.message,
            })
          );
          break;
        case errorType.password:
          setError(
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

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("signInAsync() -- Unexpected error : ", err);
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
          errorMessage={error.email}
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
          errorMessage={error.password}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title={Strings.buttons.signin}
          onPress={fetch}
          icon={
            <Icon
              name="ios-checkmark"
              type="ionicon"
              style={{ marginRight: 5 }}
            />
          }
        />
        <Loader animating={fetchIsProcessing} />
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
