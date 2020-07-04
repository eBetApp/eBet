import React from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
// LocalStorage imports
import { readStorageKey, localStorageItems } from "../Resources/LocalStorage";
// Redux imports
import { useStore } from "../Redux/store";
import { dispatchUserEdit } from "../Redux/dispatchers";
// Services imports
import userService from "../Services/userService";
// Resources imports
import { Images } from "../Resources";

export default function Avatar() {
  const { state, dispatch } = useStore();

  const chooseImage = async () => {
    const token = await readStorageKey(localStorageItems.token);
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
              : Images.defaultAvatar
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
    borderWidth: 0,
  },
});
