import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// LocalStorage imports
import { readStorage } from "../Utils/asyncStorage";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchUserEdit } from "../hooks/dispatchers";

// Services import
import userService from "../Services/userService";

export default function Avatar() {
  const { state, dispatch } = useStore();

  const chooseImage = async () => {
    const token = await readStorage("token");
    try {
      const newImage = await userService.chooseImageFromGaleryAsync();
      if (newImage === null) return;

      // (Optimistic UI) Dispatch expected res before fetch API
      dispatchUserEdit(dispatch, { avatar: newImage.uri });
      const updatedUser = await userService.postImageAsync(
        state.user,
        token,
        newImage
      );
      // (Optimistic UI) Dispatch previous value on API error
      if (updatedUser === null)
        return dispatchUserEdit(dispatch, { avatar: state.user.avatar });
    } catch (err) {
      console.log(`Error on changing avatar: ${err}`);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={chooseImage}>
        <Image
          style={styles.avatar}
          source={
            state.user.avatar != null
              ? { uri: state.user.avatar }
              : require("../../assets/defaultAvatar.png")
          }
        />
      </TouchableOpacity>
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
