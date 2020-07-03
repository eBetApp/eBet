// React imports
import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
// UI imports
import { Input, Icon } from "react-native-elements";
import {
  MainKeyboardAvoidingView,
  TextLink,
  ButtonValid,
  Loader,
  BirthdatePicker,
  ToastErr,
} from "../../components";
import { ScrollView } from "react-native-gesture-handler";
// Custom hooks imports
import { useInput, useFetchAuth } from "../../Hooks";
// Redux import
import { useStore } from "../../Redux/store";
import { dispatchUserNew } from "../../Redux/dispatchers";
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
  // Redux
  const { dispatch } = useStore();

  // States
  const useNickname = useInput();
  const useEmail = useInput();
  const usePassword = useInput();
  const [birthdate, setBirthdate] = useState(null);

  // Ref
  const pwdInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const toastErrRef = useRef(null);

  //#region FETCH TO SIGN UP
  const payload: ISignUpPayload = {
    nickname: useNickname.value,
    email: useEmail.value,
    password: usePassword.value,
    birthdate: birthdate != null ? new Date(birthdate).toISOString() : null,
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setErr) =>
    !(birthdate === null || birthdate === undefined);

  const _fetchRequest = async (setError) => userService.signUpAsync(payload);

  const _handleFetchRes = (result: ApiResponse, setError) => {
    if (result === null) {
      setError(new AuthError());
      return toastErrRef.current.show("Network error");
    } else if ((result as IAuthServiceResponse)?.status === 201) {
      dispatchUserNew(dispatch, (result as IAuthServiceResponse).data.user);
      setStorage(
        localStorageItems.token,
        (result as IAuthServiceResponse).meta.token
      );
      setError(new AuthError());
    } else if ((result as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((result as IApiResponseError).error.message)) {
        case errorType.nickname:
          setError(
            new AuthError({
              nickname: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.email:
          setError(
            new AuthError({
              email: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.password:
          setError(
            new AuthError({
              password: (result as IApiResponseError).error?.message,
            })
          );
          break;
        case errorType.birthdate:
          setError(
            new AuthError({
              birthdate: (result as IApiResponseError).error?.message,
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
    console.log("signUpAsync() -- Unexpected error : ", err);
  };
  //#endregion FETCH TO SIGN UP

  //#region VIEW
  return (
    <MainKeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView style={styles.formContainer}>
        <Input
          placeholder={Strings.inputs.ph_nickname}
          {...useNickname}
          errorMessage={error.nickname}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={emailInputRef}
          placeholder={Strings.inputs.ph_email}
          keyboardType="email-address"
          {...useEmail}
          errorMessage={error.email}
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
          errorMessage={error.password}
        />
        <BirthdatePicker
          handleNewValue={(value) => setBirthdate(value)}
          errorMessage={error.birthdate}
          placeholder={Strings.inputs.ph_birthdate}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title={Strings.buttons.signup}
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
          text={Strings.textLinks.go_sign_in}
          onPress={() => navigation.navigate(Navigation.Screens.signIn)}
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
