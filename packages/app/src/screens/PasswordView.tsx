import React, { useState, useRef, useContext } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// UI imports
import { Input, Icon } from "react-native-elements";
import { ButtonValid } from "../components/styled/Buttons";
import { MainKeyboardAvoidingView } from "../components/styled/Views";
import { Loader } from "../components/styled/Loader";
import { ThemeContext } from "react-native-elements";
import Toast from "react-native-easy-toast";
// Redux import
import { useStore } from "../hooks/store";
import useInput from "../hooks/useInput";
import { dispatchUserEdit } from "../hooks/dispatchers";
// Fetch imports
import userService from "../Services/userService";
import {
  classifyAuthError,
  AuthError,
  errorType,
} from "../Utils/parseApiError";
// LocalStorage imports
import { readStorage, localStorageItems } from "../Resources/LocalStorage";

export default function PasswordView({ navigation }) {
  // Theme
  const { theme } = useContext(ThemeContext);

  // States
  const { state, dispatch } = useStore();
  const useCurrentPassword = useInput();
  const useNewPassword = useInput();
  const useNewPasswordConfirmation = useInput();
  const [fetchUpdateIsProcessing, setFetchUpdateIsProcessing] = useState<
    boolean
  >(false);

  // States : errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

  // Refs
  const toastErrRef = useRef(null);
  const newPwdInputErrRef = useRef(null);
  const confirmNewPwdInputRef = useRef(null);

  const _submitForm = async (): Promise<void> => {
    if (
      !_checkPasswordConfirmation(
        useNewPassword.value,
        useNewPasswordConfirmation.value
      )
    )
      return setFormError(
        new AuthError({
          newPassword: "Doesn't match",
          newPasswordConfirmation: "Doesn't match",
        })
      );

    if (fetchUpdateIsProcessing) return;
    setFetchUpdateIsProcessing(true);

    const payload = {
      uuid: state.user.uuid,
      currentPwd: useCurrentPassword.value,
      newPwd: useNewPassword.value,
    };

    const token = await readStorage(localStorageItems.token);

    userService
      .updatePwdAsync(payload, token)
      .then((res) => {
        if (res === null) {
          return toastErrRef.current.show("Network error");
        } else if ((res as IApiResponseSuccess)?.status === 200) {
          delete payload.uuid;
          dispatchUserEdit(dispatch, { ...payload });
          navigation.goBack();
        } else if ((res as IApiResponseError)?.error?.status === 400) {
          switch (classifyAuthError((res as IApiResponseError).error.message)) {
            case errorType.password:
              setFormError(
                new AuthError({
                  newPassword: (res as IApiResponseError).error.message,
                })
              );
              break;
          }
        } else if ((res as IApiResponseError)?.error?.status === 403) {
          switch (classifyAuthError((res as IApiResponseError).error.message)) {
            case errorType.password:
              setFormError(
                new AuthError({
                  password: (res as IApiResponseError).error.message,
                })
              );
              break;
          }
        } else throw new Error();
      })
      .catch((error) => {
        toastErrRef.current.show("Unexpected error");
        console.log("update password -- Unexpected error : ", error);
      })
      .finally(() => setFetchUpdateIsProcessing(false));
  };

  /** Returns false when password and passwordConfirmation are different */
  const _checkPasswordConfirmation = (
    password: string,
    passwordConfirmation: string
  ): boolean => {
    return password === passwordConfirmation;
  };

  return (
    <MainKeyboardAvoidingView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <Input
          label="Current password"
          textContentType={"password"}
          secureTextEntry={true}
          {...useCurrentPassword}
          errorMessage={formError.password}
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
          errorMessage={formError.newPassword}
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
          errorMessage={formError.newPasswordConfirmation}
        />
      </ScrollView>
      <View style={styles.bottomContainer}>
        <ButtonValid
          title="SUBMIT"
          onPress={_submitForm}
          icon={
            <Icon
              name="ios-checkmark"
              type="ionicon"
              style={{ marginRight: 5 }}
            />
          }
        />
        <Loader animating={fetchUpdateIsProcessing} />
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
