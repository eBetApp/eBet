import * as ImagePicker from "expo-image-picker";

export const cameraPermissions = async () => {
  const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

  if (permissionResult.granted === false) {
    alert("Permission to access camera roll is required!");
    return;
  }
};
