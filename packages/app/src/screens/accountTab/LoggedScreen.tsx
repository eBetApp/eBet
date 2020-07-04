import React, { useState, useRef, useEffect } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
// Redux import
import { useStore } from "../../Redux/store";
import {
  dispatchUserNull,
  dispatchUserEdit,
  dispatchUserAccountBalance,
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
// Fetch imports
import { userService, stripeService } from "../../Services";
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../../Utils/parseApiError";
// webView import
import { WebView } from "react-native-webview";
// utils import
import parseUrl from "../../Utils/parseUrl";
// Custom hooks imports
import { useTextInput, useFetchAuth } from "../../Hooks";
// Resources imports
import {
  Strings,
  Navigation,
  readStorageKey,
  localStorageItems,
  removeFullStorage,
} from "../../Resources";
import { LoggedScreenProps } from "../../Navigator/Stacks";

export default function LoggedScreen({ navigation }: LoggedScreenProps) {
  let stripeAccount = "";

  // Redux
  const { dispatch, state } = useStore();

  // States
  const useEmail = useTextInput(state.user?.email ?? "");
  const useNickname = useTextInput(state.user?.nickname ?? "");
  const [birthdate, setBirthdate] = useState(
    new Date(state.user?.birthdate).toDateString() ?? ""
  );

  // Ref
  const emailInputRef = useRef(null);
  const toastErrRef = useRef(null);
  const toastSuccessRef = useRef(null);

  // useEffect
  useEffect(() => {
    fetchBalance();
  }, [state.user?.accountId]);

  const fetchBalance = (): void => {
    readStorageKey(localStorageItems.token).then((token) => {
      stripeService
        .getBalanceAsync({ accountId: state.user.accountId }, token)
        .then((res) => {
          if (res === null) return;
          const _res = res as IApiResponseSuccess;
          if (_res == null) return;
          dispatchUserAccountBalance(dispatch, _res.data.balance);
        })
        .catch((err) => {
          console.log("getBalance() -- Unexpected error : ", err);
        });
    });
  };

  const _renderWebView = () => (
    <WebView
      source={{
        uri:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HLOVRxlYXifqJlpAxypmnbp3OPhd8dXU&scope=read_write",
      }}
      onNavigationStateChange={(navState) => {
        const params = parseUrl(navState.url);
        if (params?.code !== undefined && params?.code !== stripeAccount) {
          stripeAccount = params?.code;
          fetchCreateStripeAccount(stripeAccount);
        }
      }}
    />
  );

  const fetchCreateStripeAccount = async (code: string): Promise<void> => {
    const token = await readStorageKey(localStorageItems.token);

    const stripePayload = {
      uuid: state.user.uuid,
      code,
    };

    stripeService
      .postNewAccountAsync(stripePayload, token)
      .then((result) => {
        dispatchUserEdit(dispatch, {
          accountId: (result as IApiResponseSuccess)?.data?.accountId,
        });
      })
      .catch((err) => console.log("error", err));
  };

  //#region FETCH EDIT ACCOUNT
  const payload = {
    uuid: state.user?.uuid,
    email: useEmail.value,
    nickname: useNickname.value,
    birthdate: new Date(birthdate).toISOString(),
  };

  const {
    fetch: fetchEditAccount,
    fetchIsProcessing: fetchEditIsProcessing,
    error,
  } = useFetchAuth(
    new AuthError(),
    (setErr) => _preFetchRequest(setErr),
    async (setErr) => _fetchRequest(setErr),
    (res, err) => _handleFetchRes(res, err),
    (err) => _handleFetchErr(err)
  );

  const _preFetchRequest = (setError) =>
    birthdate !== null && birthdate !== undefined;

  const _fetchRequest = async (setError) => {
    const token = await readStorageKey(localStorageItems.token);
    return userService.updateAsync(payload, token);
  };

  const _handleFetchRes = (res, setError) => {
    if (res === null) {
      return toastErrRef.current.show("Network error");
    } else if ((res as IApiResponseSuccess)?.status === 200) {
      delete payload.uuid;
      dispatchUserEdit(dispatch, { ...payload });
      toastSuccessRef.current.show("👍 Update is done");
      setError(new AuthError());
    } else if ((res as IApiResponseError)?.error?.status === 400) {
      switch (classifyAuthError((res as IApiResponseError).error.message)) {
        case errorType.nickname:
          setError(new AuthError({ nickname: "Wrong format" }));
          break;
        case errorType.email:
          setError(new AuthError({ email: "Wrong format" }));
          break;
        case errorType.birthdate:
          setError(new AuthError({ birthdate: "Wrong format" }));
          break;
      }
    } else throw new Error();
  };

  const _handleFetchErr = (err: any) => {
    toastErrRef.current.show("Unexpected error");
    console.log("updateUserAsync() -- Unexpected error : ", error);
  };
  // #enregion FETCH EDIT ACCOUNT

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
              onPress={() => fetchEditAccount()}
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
              dispatchUserNull(dispatch);
              dispatchUserAccountBalanceNull(dispatch);
              removeFullStorage();
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
