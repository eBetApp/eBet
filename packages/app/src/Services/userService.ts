import { Platform } from "react-native";

// Expo imports
import * as ImagePicker from "expo-image-picker";

// Repositories imports
import UserRepository from "../Repositories/userRepository";

// Services imports
import { cameraPermissions } from "./devicePermissionsService";

// Types imports
import { User } from "../../ApiTypes/User.types";
import { ImageInfo } from "expo-image-picker/build/ImagePicker.types";

const chooseImageFromGaleryAsync = async (): Promise<ImageInfo | null> => {
  await cameraPermissions();

  const responseImage = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    aspect: [4, 3],
    quality: 1,
  });

  return responseImage.cancelled ? null : (responseImage as ImageInfo);
};

const postImageAsync = async (
  user: User,
  token: string,
  image: ImageInfo
): Promise<User | null> => {
  try {
    const responseFetch = await UserRepository.postPicture(
      _createFormData(user.uuid, image),
      token
    );

    let oldImageUri = user.avatar;
    user.avatar = responseFetch.user.avatar;

    if (oldImageUri != null && oldImageUri != "") {
      UserRepository.deletePicture(oldImageUri, token);
    }
    return user;
  } catch (err) {
    return null;
  }
};

const _createFormData = (uuid: any, photo: any) => {
  // Get the filename of the image
  const { uri } = photo;
  const name = uri.split("/").pop();

  // Get the type of the image
  const match = /\.(\w+)$/.exec(name);
  const type = match ? `image/${match[1]}` : `image`;

  // Create FormaData with image data
  const data = new FormData();
  data.append("uuid", uuid);
  data.append("file", {
    name,
    type,
    uri: Platform.OS === "android" ? uri : uri.replace("file://", ""),
  });
  return data;
};

export default { chooseImageFromGaleryAsync, postImageAsync };
