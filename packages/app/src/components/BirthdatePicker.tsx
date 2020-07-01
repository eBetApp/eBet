// React imports
import React, { useState } from "react";
import { TouchableOpacity, Platform } from "react-native";
// UI imports
import { Input } from "react-native-elements";
import DateTimePicker from "@react-native-community/datetimepicker";

interface IProps {
  initValue?: string;
  placeholder?: string;
  errorMessage: string;
  handleNewValue: (value: string) => void;
}

export default function BirthdatePicker(props: IProps) {
  const [birthdate, setBirthdate] = useState(props.initValue);
  const date = new Date(Date.now());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === "ios");
    setBirthdate(selectedDate.toDateString());
    props.handleNewValue(selectedDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <>
      <TouchableOpacity onPress={showDatepicker}>
        <Input
          editable={false}
          placeholder={props.placeholder}
          value={birthdate}
          errorMessage={props.errorMessage}
        />
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          onChange={onChange}
        />
      )}
    </>
  );
}
