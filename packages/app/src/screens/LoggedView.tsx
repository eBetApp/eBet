import React, { useState, useRef, useContext, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
// Redux import
import { useStore } from "../hooks/store";
import {
  dispatchUserNull,
  dispatchUserEdit,
  dispatchUserAccountBalance,
  dispatchUserAccountBalanceNull,
} from "../hooks/dispatchers";
// UI imports
import { Input, ThemeContext, Icon } from "react-native-elements";
import {
  ButtonCancel,
  ButtonEdit,
  ButtonValid,
} from "../components/styled/Buttons";
import { MainKeyboardAvoidingView } from "../components/styled/Views";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-easy-toast";
import { Loader } from "../components/styled/Loader";
// Fetch imports
import queryString from "query-string";
import userService from "../Services/userService";
import betService from "../Services/betService";
import {
  classifyAuthError,
  errorType,
  AuthError,
} from "../Utils/parseApiError";
// .env imports
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";
// webView import
import { WebView } from "react-native-webview";
// utils import
import parseUrl from "../Utils/parseUrl";
// LocalStorage imports
import {
  readStorage,
  removeStorage,
  localStorageItems,
} from "../Resources/LocalStorage";
// Components imports
import Avatar from "../components/Avatar";
// Custom hooks imports
import useInput from "../hooks/useInput";
// Navigation imports
import { Screens } from "../Resources/NavigationStacks";

export default function LoggedView({ navigation }) {
  let stripeAccount = "";

  // Theme
  const { theme } = useContext(ThemeContext);

  // Redux
  const { dispatch, state } = useStore();

  // States
  const useEmail = useInput(state.user?.email ?? "");
  const useNickname = useInput(state.user?.nickname ?? "");
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
    _fetchBalance();
  }, []);

  //#region DATEPICKER
  const date = new Date(state.user?.birthdate);
  const [show, setShow] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setBirthdate(selectedDate.toDateString());
  };

  const showDatepicker = () => {
    setShow(true);
  };
  //#endregion DATEPICKER

  const _fetchBalance = (): void => {
    readStorage(localStorageItems.token).then((token) => {
      betService
        .getBalanceAsync({ accountId: state.user.accountId }, token)
        .then((res) => {
          if (res === null) return;
          const _res = res as IApiResponseSuccess;
          if (_res == null) return;
          dispatchUserAccountBalance(dispatch, _res.data.balance);
          // navigation.setOptions({ title: `My account: ${_res.data.balance}` });
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
          _createStripeAccount(stripeAccount);
        }
      }}
    />
  );

  const _createStripeAccount = async (code: string): Promise<void> => {
    const token = await readStorage(localStorageItems.token);

    const myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    });

    const payload = {
      uuid: state.user.uuid,
      code,
    };

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: queryString.stringify(payload),
    };

    fetch(`${REACT_NATIVE_BACK_URL}/api/payments/set-account`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatchUserEdit(dispatch, { accountId: result?.data?.accountId });
      })
      .catch((error) => console.log("error", error));
  };

  const _submitEdit = async (): Promise<void> => {
    if (userIsUpdating) return;
    if (birthdate === null || birthdate === undefined) return;
    setUserIsUpdating(true);

    const payload = {
      uuid: state.user.uuid,
      email: useEmail.value,
      nickname: useNickname.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    const token = await readStorage(localStorageItems.token);

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
          label="Nickname"
          errorMessage={formError.nickname}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <Input
          ref={emailInputRef}
          {...useEmail}
          label="Email"
          keyboardType="email-address"
          errorMessage={formError.email}
        />
        <TouchableOpacity onPress={showDatepicker}>
          <Input
            editable={false}
            label="Birthdate"
            placeholder="Birthdate"
            value={birthdate}
            errorMessage={formError.birthdate}
          />
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity onPress={() => navigation.navigate(Screens.password)}>
          <Input editable={false} label="Password" placeholder="••••••••••••" />
        </TouchableOpacity>
        <View style={styles.bottomContainer}>
          <View style={styles.buttonContainer}>
            <ButtonEdit
              title="Edit"
              onPress={() => _submitEdit()}
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
              title="Claim"
              onPress={() => navigation.navigate(Screens.claimMoney)}
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
            title="Exit"
            onPress={() => {
              dispatchUserNull(dispatch);
              dispatchUserAccountBalanceNull(dispatch);
              removeStorage(localStorageItems.token);
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
      <Toast
        ref={toastErrRef}
        position="top"
        style={{ borderRadius: 20 }}
        textStyle={{ color: theme.colors.error }}
      />
      <Toast
        ref={toastSuccessRef}
        position="center"
        style={{ borderRadius: 20 }}
        textStyle={{ color: theme.colors.primary }}
      />
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
