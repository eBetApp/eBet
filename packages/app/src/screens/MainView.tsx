import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

// Types imports
import { User } from "../../ApiTypes/User.types";

// Redux import
import { useStore } from "../hooks/store";
import { dispatchAvatar } from "../hooks/dispatchers";

// Services import
import userService from "../Services/userService";

export default function MainView() {
  const { state, dispatch } = useStore();

  const user: User = {
    uuid: "80e97e1a-11fd-48be-85c8-dbcb7d65dc46",
    nickname: "bob31",
    email: "bob31@gmail.com",
    password: "123456",
  };

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjgwZTk3ZTFhLTExZmQtNDhiZS04NWM4LWRiY2I3ZDY1ZGM0NiIsIm5pY2tuYW1lIjoiYm9iMzEiLCJlbWFpbCI6ImJvYjMxYkBnbWFpbC5jb20iLCJpYXQiOjE1ODY4ODQ5MjJ9.rRG1Eun4Kb5F471fJlpqMyxusuPlMx6PuCtaWSoG4BI";

  const chooseImage = async () => {
    try {
      const newImage = await userService.chooseImageFromGaleryAsync();
      if (newImage === null) return;

      // (Optimistic UI) Dispatch expected res before fetch API
      dispatchAvatar(dispatch, newImage.uri);

      const updatedUser = await userService.postImageAsync(
        user,
        token,
        newImage
      );

      // (Optimistic UI) Dispatch previous value on API error
      if (updatedUser === null) return dispatchAvatar(dispatch, user.avatar);
    } catch (err) {
      console.log(`Error on changing avatar: ${err}`);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={chooseImage}>
        <Text>Press Here</Text>
      </TouchableOpacity>

      <Image style={styles.avatar} source={{ uri: state.avatar }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
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
