import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// LocalStorage imports
import { readStorage } from "../Utils/asyncStorage";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchAvatar } from "../hooks/dispatchers";

// Services import
import userService from "../Services/userService";

export default function Avatar() {
  const { state, dispatch } = useStore();

  const chooseImage = async () => {
    const token = await readStorage("token");
    console.log("TOKEN: ", token);
    try {
      const newImage = await userService.chooseImageFromGaleryAsync();
      console.log("NEW IMAGE: ", newImage);
      console.log("NEW IMAGE uri: ", newImage.uri);
      if (newImage === null) return;

      // (Optimistic UI) Dispatch expected res before fetch API
      dispatchAvatar(dispatch, newImage.uri);
      console.log("user: ");
      console.log(state.user);
      const updatedUser = await userService.postImageAsync(
        state.user,
        token,
        newImage
      );
      console.log("updatedUser");
      console.log(updatedUser);
      // (Optimistic UI) Dispatch previous value on API error
      if (updatedUser === null)
        return dispatchAvatar(dispatch, state.user.avatar);
    } catch (err) {
      console.log(`Error on changing avatar: ${err}`);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={chooseImage}>
        <Text>Change avatar by press Here</Text>
      </TouchableOpacity>

      <Image style={styles.avatar} source={{ uri: state.avatar }} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 2,
    borderColor: "white",
  },
  touchable: {
    width: 130,
    height: 130,
    marginBottom: 10,
    alignSelf: "center",
    position: "absolute",
    marginTop: 90,
  },
});
