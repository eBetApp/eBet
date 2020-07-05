// React imports
import React from "react";
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
// Hooks imports
import { signUpScreenVM } from "../../Hooks";
// Redux import
import { useStore } from "../../Redux/store";
// Resources imports
import { Strings, Navigation } from "../../Resources";
import { SignUpScreenProps } from "../../Navigator/Stacks";

export default function SignUpScreen({ navigation }: SignUpScreenProps) {
  // Redux
  const { dispatch } = useStore();

  // Fetch
  const {
    setBirthdate,
    useNickname,
    useEmail,
    usePassword,
    emailInputRef,
    pwdInputRef,
    toastErrRef,
    fetch,
    fetchIsProcessing,
    error,
  } = signUpScreenVM.useInitAuthFetch(dispatch);

  // View
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
