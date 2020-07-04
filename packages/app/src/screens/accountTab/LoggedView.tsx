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
import { useTextInput } from "../../Hooks";
// Resources imports
import {
  Strings,
  Navigation,
  readStorageKey,
  localStorageItems,
  removeFullStorage,
} from "../../Resources";

export default function LoggedView({ navigation }) {
  let stripeAccount = "";

  // Redux
  const { dispatch, state } = useStore();

  // States
  const useEmail = useTextInput(state.user?.email ?? "");
  const useNickname = useTextInput(state.user?.nickname ?? "");
  const [birthdate, setBirthdate] = useState(
    new Date(state.user?.birthdate).toDateString() ?? ""
  );
  const [userIsUpdating, setUserIsUpdating] = useState<boolean>(false);

  // States: Errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

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
        .catch((error) => {
          console.log("getBalance() -- Unexpected error : ", error);
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

    const payload = {
      uuid: state.user.uuid,
      code,
    };

    stripeService
      .postNewAccountAsync(payload, token)
      .then((result) => {
        dispatchUserEdit(dispatch, {
          accountId: (result as IApiResponseSuccess)?.data?.accountId,
        });
      })
      .catch((error) => console.log("error", error));
  };

  const fetchEditAccount = async (): Promise<void> => {
    if (userIsUpdating) return;
    if (birthdate === null || birthdate === undefined) return;
    setUserIsUpdating(true);

    const payload = {
      uuid: state.user.uuid,
      email: useEmail.value,
      nickname: useNickname.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    const token = await readStorageKey(localStorageItems.token);

    userService
      .updateAsync(payload, token)
      .then((res) => {
        if (res === null) {
          return toastErrRef.current.show("Network error");
        } else if ((res as IApiResponseSuccess)?.status === 200) {
          delete payload.uuid;
          dispatchUserEdit(dispatch, { ...payload });
          toastSuccessRef.current.show("👍 Update is done");
          setFormError(new AuthError());
        } else if ((res as IApiResponseError)?.error?.status === 400) {
          switch (classifyAuthError((res as IApiResponseError).error.message)) {
            case errorType.nickname:
              setFormError(new AuthError({ nickname: "Wrong format" }));
              break;
            case errorType.email:
              setFormError(new AuthError({ email: "Wrong format" }));
              break;
            case errorType.birthdate:
              setFormError(new AuthError({ birthdate: "Wrong format" }));
              break;
          }
        } else throw new Error();
      })
      .catch((error) => {
        toastErrRef.current.show("Unexpected error");
        console.log("updateUserAsync() -- Unexpected error : ", error);
      })
      .finally(() => setUserIsUpdating(false));
  };

  const _renderLoggedView = () => (
    <MainKeyboardAvoidingView style={styles.mainContainer}>
      <ScrollView style={styles.formContainer}>
        <View style={{ alignSelf: "center" }}>
          <Avatar />
        </View>
        <Input
          {...useNickname}
          label={Strings.inputs.label_nickname}
          errorMessage={formError.nickname}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={emailInputRef}
          {...useEmail}
          label={Strings.inputs.label_email}
          keyboardType="email-address"
          errorMessage={formError.email}
        />
        <BirthdatePicker
          initValue={birthdate}
          handleNewValue={(value) => setBirthdate(value)}
          placeholder={Strings.inputs.ph_birthdate}
          errorMessage={formError.birthdate}
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

      <Loader animating={userIsUpdating} />
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
