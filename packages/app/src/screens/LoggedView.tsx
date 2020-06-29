import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TouchableOpacity,
  Platform,
} from "react-native";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserNull, dispatchUserEdit } from "../hooks/dispatchers";

// UI imports
import { Text, Input } from "react-native-elements";
import {
  ButtonValid,
  ButtonCancel,
  ButtonEdit,
} from "../components/styled/Buttons";
import { MainView } from "../components/styled/MainView";
import DateTimePicker from "@react-native-community/datetimepicker";

// Fetch imports
import queryString from "query-string";

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
import userService from "../Services/userService";
import { classifyError, errorType } from "../Utils/parseApiError";
import { Screens } from "../Resources/Navigation";

export default function LoggedView({ navigation }) {
  const { dispatch, state } = useStore();
  const useEmail = useInput(state.user?.email ?? "");
  const useNickname = useInput(state.user?.nickname ?? "");
  const [birthdate, setBirthdate] = useState(
    new Date(state.user?.birthdate).toDateString() ?? ""
  );
  const [errorNickname, setErrorNickname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorBirthdate, setErrorBirthdate] = useState("");

  let stripeAccount = "";

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

  const _createStripeAccount = async (code: string) => {
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

  const _submitEdit = async () => {
    const payload = {
      uuid: state.user.uuid,
      email: useEmail.value,
      nickname: useNickname.value,
      birthdate: new Date(birthdate).toISOString(),
    };

    const token = await readStorage("token");

    console.log("payload: ", payload);
    userService
      .updateAsync(payload, token)
      .then((res) => {
        console.log("###RES");
        console.log(res);
        if (res.status === 200) {
          delete payload.uuid;
          dispatchUserEdit(dispatch, { ...payload });
          navigation.goBack();
        }
        if (res.error?.status === 400) {
          switch (classifyError(res.error.message)) {
            case errorType.nickname:
              setErrorNickname("Wrong format");
            // setErrorEmail("");
            // setErrorBirthdate("");
            case errorType.email:
              console.log("###");
              console.log(res.error.message);
              setErrorEmail("Wrong format");
            // setErrorBirthdate("");
            // setErrorNickname("");
            case errorType.birthdate:
              setErrorBirthdate("Wrong format");
            // setErrorEmail("");
            // setErrorNickname("");
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const _renderLoggedView = () => (
    <MainView style={styles.mainContainer}>
      <ScrollView style={styles.formContainer}>
        <View style={{ alignSelf: "center" }}>
          <Avatar />
        </View>
        <Input {...useNickname} label="Nickname" errorMessage={errorNickname} />
        <Input
          {...useEmail}
          label="Email"
          keyboardType="email-address"
          errorMessage={errorEmail}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
        <TouchableOpacity onPress={showDatepicker}>
          <Input
            editable={false}
            label="Birthdate"
            placeholder="Birthdate"
            value={birthdate}
            errorMessage={errorBirthdate}
          />
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.buttonsContainer}>
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
    </MainView>
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
  buttonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flex: 1,
  },
  bottomContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});
