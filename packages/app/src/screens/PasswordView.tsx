import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// UI imports
import { Input, Icon, Text } from "react-native-elements";
import { ButtonValid } from "../components/styled/Buttons";
import { MainKeyboardAvoidingView } from "../components/styled/Views";

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
import { readStorage } from "../Utils/asyncStorage";

export default function PasswordView({ navigation }) {
  const { state, dispatch } = useStore();
  const useCurrentPassword = useInput();
  const useNewPassword = useInput();
  const useNewPasswordConfirmation = useInput();
  const [formError, setFormError] = useState<AuthError>(new AuthError());

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

    const payload = {
      uuid: state.user.uuid,
      currentPwd: useCurrentPassword.value,
      newPwd: useNewPassword.value,
    };

    const token = await readStorage("token");

    userService
      .updatePwdAsync(payload, token)
      .then((res) => {
        if (res.status === 200) {
          delete payload.uuid;
          dispatchUserEdit(dispatch, { ...payload });
          navigation.goBack();
        }
        if (res.error?.status === 400) {
          switch (classifyAuthError(res.error.message)) {
            case errorType.password:
              setFormError(new AuthError({ newPassword: res.error.message }));
              break;
          }
        }
        if (res.error?.status === 403) {
          switch (classifyAuthError(res.error.message)) {
            case errorType.password:
              setFormError(new AuthError({ password: res.error.message }));
              break;
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
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
        />
        <Input
          label="New password"
          textContentType={"password"}
          secureTextEntry={true}
          {...useNewPassword}
          errorMessage={formError.newPassword}
        />
        <Input
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
