import React, { useRef, useEffect } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
// UI imports
import { Input, Icon } from "react-native-elements";
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
import { useTextInput, useFetchAuth } from "../../Hooks";
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
  readStorageKey,
} from "../../Resources";
import { SignInScreenProps } from "../../Navigator/Stacks";

export default function SignInScreen({ navigation }: SignInScreenProps) {
  // Redux
  const { dispatch } = useStore();

  // States
  const useEmail = useTextInput();
  const usePassword = useTextInput();

  // Ref
  const pwdInputRef = useRef(null);
  const toastErrRef = useRef(null);

  //#region INIT FETCH FROM LOCAL STORAGE
  const {
    fetch: initFetchFromLocalStorage,
    fetchIsProcessing: initLoading,
  } = useFetchAuth(
    null,
    (setErr) => true,
    async (setErr) => _initFetchFromLocalStorageRequest(setErr),
    (res, err) => _handleinitFetchFromLocalStorageRes(res, err),
    (err) => {} // tslint:disable-line
  );

  let token: string;
  let uuid: string;

  useEffect(() => {
    const tokenPromise = readStorageKey(localStorageItems.token);
    const uuidPromise = readStorageKey(localStorageItems.userUuid);
    Promise.all([tokenPromise, uuidPromise])
      .then((values) => ([token, uuid] = values))
      .then(() => {
        if (
          token === null ||
          token === undefined ||
          uuid === null ||
          uuid === undefined
        )
          return;
        initFetchFromLocalStorage();
      });
  }, []);

  const _initFetchFromLocalStorageRequest = async (setErr) =>
    userService.getUserAsync(uuid, token);

  const _handleinitFetchFromLocalStorageRes = (res, setError) => {
    if (res !== null && (res as IApiResponseSuccess)?.status === 200)
      dispatchUserNew(dispatch, (res as IApiResponseSuccess)?.data.user);
  };
  //#endregion INIT FETCH FROM LOCAL STORAGE

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
      setStorage(
        localStorageItems.userUuid,
        (result as IAuthServiceResponse).data.user.uuid
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
    <>
      {initLoading ? (
        <Loader style={{ flex: 1 }} />
      ) : (
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
      )}
    </>
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
