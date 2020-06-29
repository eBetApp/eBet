import React, { useState, useRef, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNull, dispatchUserEdit } from "../hooks/dispatchers";

// UI imports
import { Input, ThemeContext } from "react-native-elements";
import { ButtonCancel, ButtonEdit } from "../components/styled/Buttons";
import { MainKeyboardAvoidingView } from "../components/styled/Views";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-easy-toast";

// Fetch imports
import queryString from "query-string";
import userService from "../Services/userService";
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
import { readStorage, removeStorage } from "../Utils/asyncStorage";

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

  // States: Errors
  const [formError, setFormError] = useState<AuthError>(new AuthError());

  // Ref
  const emailInputRef = useRef(null);
  const toastErrRef = useRef(null);

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

  const _renderWebView = () => (
    <WebView
      source={{
        uri:
          "https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_HLOVRxlYXifqJlpAxypmnbp3OPhd8dXU&scope=read_write",
      }}
      onNavigationStateChange={(navState) => {
        const params = parseUrl(navState.url);
        if (params?.code !== undefined && params?.code != stripeAccount) {
          stripeAccount = params?.code;
          _createStripeAccount(stripeAccount);
        }
      }}
    />
  );

  const _createStripeAccount = async (code: string): Promise<void> => {
    const token = await readStorage("token");

    const myHeaders = new Headers({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${token}`,
    });

    const payload = {
      uuid: state.user.uuid,
      code,
    };

    var requestOptions = {
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
    const payload = {
      uuid: state.user.uuid,
      email: useEmail.value,
      nickname: useNickname.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    const token = await readStorage("token");

    userService
      .updateAsync(payload, token)
      .then((res) => {
        if (res === null) {
          return toastErrRef.current.show("Network error");
        } else if (res?.status === 200) {
          delete payload.uuid;
          dispatchUserEdit(dispatch, { ...payload });
          navigation.goBack();
        }
        if (res?.error?.status === 400) {
          switch (classifyAuthError(res.error.message)) {
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
      });
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
      </ScrollView>
      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <ButtonEdit title="EDIT" onPress={() => _submitEdit()} />
        </View>
        <View style={styles.buttonContainer}>
          <ButtonCancel
            title="LOG OUT"
            onPress={() => {
              dispatchUserNull(dispatch);
              removeStorage("token");
            }}
          />
        </View>
      </View>
      <Toast
        ref={toastErrRef}
        position="top"
        style={{ borderRadius: 20 }}
        textStyle={{ color: theme.colors.error }}
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
