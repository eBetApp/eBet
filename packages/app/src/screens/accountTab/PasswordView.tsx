import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI imports
import { Input, Icon } from "react-native-elements";
import {
  ButtonValid,
  MainKeyboardAvoidingView,
  Loader,
  ToastErr,
} from "../../components";
// Redux import
import { useStore } from "../../Redux/store";
import { useInput, useFetchAuth } from "../../Hooks";
import { dispatchUserEdit } from "../../Redux/dispatchers";
// Fetch imports
import { userService } from "../../Services";
import {
  classifyAuthError,
  AuthError,
  errorType,
} from "../../Utils/parseApiError";
// Resources imports
import { Strings, readStorageKey, localStorageItems } from "../../Resources";

export default function PasswordView({ navigation }) {
  // States
  const { state, dispatch } = useStore();
  const useCurrentPassword = useInput();
  const useNewPassword = useInput();
  const useNewPasswordConfirmation = useInput();

  // Refs
  const toastErrRef = useRef(null);
  const newPwdInputErrRef = useRef(null);
  const confirmNewPwdInputRef = useRef(null);

  //#region FETCH TO UPDATE PWD
  const payload: IPwdUpdatePayload = {
    uuid: state.user.uuid,
    currentPwd: useCurrentPassword.value,
    newPwd: useNewPassword.value,
  };

  const { fetch, fetchIsProcessing, error } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setError) => {
    if (useNewPassword.value !== useNewPasswordConfirmation.value) {
      setError(
        new AuthError({
          newPassword: "Doesn't match",
          newPasswordConfirmation: "Doesn't match",
        })
      );
      return false;
    }
    return true;
  };

  const _fetchRequest = async (setError) => {
    const token = await readStorageKey(localStorageItems.token);
    return userService.updatePwdAsync(payload, token);
  };

  const _handleFetchRes = (res, setError) => {
    if (res === null) {
      setError(new AuthError());
      return toastErrRef.current.show("Network error");
    } else if ((res as IApiResponseSuccess)?.status === 200) {
      delete payload.uuid;
      dispatchUserEdit(dispatch, { ...payload });
      navigation.goBack();
    } else if (
      (res as IApiResponseError)?.error?.status === 400 &&
      classifyAuthError((res as IApiResponseError).error.message) ===
        errorType.password
    ) {
      setError(
        new AuthError({
          newPassword: (res as IApiResponseError).error.message,
        })
      );
    } else if (
      (res as IApiResponseError)?.error?.status === 403 &&
      classifyAuthError((res as IApiResponseError).error.message) ===
        errorType.password
    ) {
      setError(
        new AuthError({
          password: (res as IApiResponseError).error.message,
        })
      );
    } else throw new Error();
  };

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("update password -- Unexpected error : ", err);
  };
  //#endregion FETCH TO UPDATE PWD

  //#region VIEW
  return (
    <MainKeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Input
          label="Current password"
          textContentType={"password"}
          secureTextEntry={true}
          {...useCurrentPassword}
          errorMessage={error.password}
          returnKeyType="next"
          onSubmitEditing={() => newPwdInputErrRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={newPwdInputErrRef}
          label="New password"
          textContentType={"password"}
          secureTextEntry={true}
          {...useNewPassword}
          errorMessage={error.newPassword}
          returnKeyType="next"
          onSubmitEditing={() => confirmNewPwdInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={confirmNewPwdInputRef}
          label="New password confirmation"
          textContentType={"password"}
          secureTextEntry={true}
          {...useNewPasswordConfirmation}
          errorMessage={error.newPasswordConfirmation}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title={Strings.buttons.submit}
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
