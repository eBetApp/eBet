import { Platform } from "react-native";

// Expo imports
import * as ImagePicker from "expo-image-picker";

// Fetch imports
import queryString from "query-string";

// Repositories imports
import UserRepository from "../Repositories/ebetRepository";

// Services imports
import { cameraPermissions } from "./devicePermissionsService";

// Types imports
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

const putAvatarAsync = async (
  user: User,
  token: string,
  image: ImageInfo
): Promise<User | null> => {
  try {
    const responseFetch = await UserRepository.postPicture(
      _createFormData(user.uuid, image),
      token
    );
    user.avatar = responseFetch.data?.user.avatar;

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

const signUpAsync = async (
  payload: ISignUpPayload
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.post(
      "auth/signup",
      queryString.stringify(payload)
    );
  } catch (err) {
    return null;
  }
};

const signInAsync = async (
  payload: ISignInPayload
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.post(
      "auth/signin",
      queryString.stringify(payload)
    );
  } catch (err) {
    return null;
  }
};

const updateAsync = async (
  payload: Partial<User>,
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.put(
      "user/update",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

const updatePwdAsync = async (
  payload: IPwdUpdatePayload,
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.put(
      "user/update-password",
      queryString.stringify(payload),
      token
    );
  } catch (err) {
    return null;
  }
};

const getUserAsync = async (
  uuid: string,
  token: string
): Promise<ApiResponse | null> => {
  try {
    return await UserRepository.get(
      `user/get/${uuid}`,
      queryString.stringify({}),
      token
    );
  } catch (err) {
    return null;
  }
};

export default {
  chooseImageFromGaleryAsync,
  postImageAsync: putAvatarAsync,
  signUpAsync,
  signInAsync,
  updateAsync,
  updatePwdAsync,
  getUserAsync,
};
