// React imports
import React, { useRef } from "react";
// UI imports
import { StyleSheet, View, ScrollView } from "react-native";
import { Input, Icon } from "react-native-elements";
import {
  ButtonValid,
  TextLink,
  MainKeyboardAvoidingView,
  Loader,
  ToastErr,
} from "../../components";
// Redux import
import { useStore } from "../../Redux/store";
// Resources imports
import { Strings, Navigation } from "../../Resources";
import { SignInScreenProps } from "../../Navigator/Stacks";
// Hooks imports
import { signInScreenVM } from "../../Hooks";

export default function SignInScreen({ navigation, route }: SignInScreenProps) {
  // Redux
  const { dispatch } = useStore();

  // Ref
  const pwdInputRef = useRef(null);

  // Fetch
  const { fetchIsProcessing: initLoading } = signInScreenVM.useInitAuthFetch(
    dispatch
  );

  const {
    useEmail,
    usePassword,
    toastErrRef,
    fetch,
    fetchIsProcessing,
    error,
  } = signInScreenVM.useSignInFetch(dispatch, { navigation, route });

  // View
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
