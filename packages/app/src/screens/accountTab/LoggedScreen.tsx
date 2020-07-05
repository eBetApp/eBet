import React, { useRef } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
// Redux import
import { useStore } from "../../Redux/store";
import {
  dispatchUserNull,
  dispatchUserAccountBalanceNull,
} from "../../Redux/dispatchers";
// UI imports
import { Input, Icon } from "react-native-elements";
import {
  MainKeyboardAvoidingView,
  ButtonCancel,
  ButtonEdit,
  ButtonValid,
  Loader,
  BirthdatePicker,
  Avatar,
  ToastErr,
  ToastSuccess,
} from "../../components";
// webView import
import { WebView } from "react-native-webview";
// Custom hooks imports
import { loggedScreenVM } from "../../Hooks";
// Resources imports
import { Strings, Navigation, removeFullStorage } from "../../Resources";
import { LoggedScreenProps } from "../../Navigator/Stacks";

export default function LoggedScreen({ navigation }: LoggedScreenProps) {
  // Redux
  const { dispatch, state } = useStore();

  // Ref
  const emailInputRef = useRef(null);

  // Fetch
  loggedScreenVM.useStripeBalanceFetch(state, dispatch);

  const {
    useEmail,
    useNickname,
    birthdate,
    setBirthdate,
    toastErrRef,
    toastSuccessRef,
    fetch: fetchEdit,
    fetchIsProcessing: fetchEditIsProcessing,
    error,
  } = loggedScreenVM.useEditUserFetch(state, dispatch);

  const { setUrl } = loggedScreenVM.useSetStripeAccountFetch(state, dispatch);

  // Views
  const _renderWebView = () => (
    <WebView
      source={{
        uri:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HLOVRxlYXifqJlpAxypmnbp3OPhd8dXU&scope=read_write",
      }}
      onNavigationStateChange={(navState) => {
        setUrl(navState.url);
      }}
    />
  );

  const _renderLoggedView = () => (
    <MainKeyboardAvoidingView style={styles.mainContainer}>
      <ScrollView style={styles.formContainer}>
        <View style={{ alignSelf: "center" }}>
          <Avatar />
        </View>
        <Input
          {...useNickname}
          label={Strings.inputs.label_nickname}
          errorMessage={error.nickname}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={emailInputRef}
          {...useEmail}
          label={Strings.inputs.label_email}
          keyboardType="email-address"
          errorMessage={error.email}
        />
        <BirthdatePicker
          initValue={birthdate}
          handleNewValue={(value) => setBirthdate(value)}
          placeholder={Strings.inputs.ph_birthdate}
          errorMessage={error.birthdate}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate(Navigation.Screens.password)}
        >
          <Input
            editable={false}
            label={Strings.inputs.label_password}
            placeholder="••••••••••••"
          />
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <ButtonEdit
              title={Strings.buttons.edit}
              onPress={() => fetchEdit()}
              icon={
                <Icon
                  name="edit"
                  type="font-awesome"
                  style={{ marginRight: 5 }}
                />
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <ButtonValid
              title={Strings.buttons.claim}
              onPress={() => navigation.navigate(Navigation.Screens.claimMoney)}
              icon={
                <Icon
                  name="logo-euro"
                  type="ionicon"
                  style={{ marginRight: 5 }}
                />
              }
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <ButtonCancel
            title={Strings.buttons.exit}
            onPress={() => {
              removeFullStorage().then(() => {
                dispatchUserNull(dispatch);
                dispatchUserAccountBalanceNull(dispatch);
              });
            }}
            icon={
              <Icon
                name="sign-out"
                type="font-awesome"
                style={{ marginRight: 5 }}
              />
            }
          />
        </View>
      </ScrollView>

      <Loader animating={fetchEditIsProcessing} />
      <ToastErr setRef={toastErrRef} position="top" />
      <ToastSuccess setRef={toastSuccessRef} position="center" />
    </MainKeyboardAvoidingView>
  );

  return (
    <>
      {state.user?.accountId != null ? _renderLoggedView() : _renderWebView()}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  formContainer: {
    alignSelf: "stretch",
  },
  bottomContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 1,
  },
});
