import React from "react";
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
import { passwordScreenVM } from "../../Hooks";
// Resources imports
import { Strings } from "../../Resources";
import { PasswordScreenProps } from "../../Navigator/Stacks";

export default function PasswordScreen({
  navigation,
  route,
}: PasswordScreenProps) {
  // Redux
  const { state, dispatch } = useStore();

  // Fetch
  const {
    useCurrentPassword,
    useNewPassword,
    useNewPasswordConfirmation,
    toastErrRef,
    newPwdInputErrRef,
    confirmNewPwdInputRef,
    fetch,
    fetchIsProcessing,
    error,
  } = passwordScreenVM.useEditPwdFetch(state, dispatch, { navigation, route });

  // View
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
