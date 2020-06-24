// .env imports
import {
  REACT_NATIVE_BACK_URL,
  REACT_NATIVE_S3_URL,
} from "react-native-dotenv";

const _CRUD = {
  delete: async (endPoint: string, token: string) => {
    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.json();
    } catch (err) {
      throw err;
    }
  },
  post: async (endPoint: string, body: FormData, token: string) => {
    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      return response.json();
    } catch (err) {
      throw err;
    }
  },
  put: async (endPoint: string, body: FormData, token: string) => {
    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
};

const putPicture = async (body: FormData, token) =>
  _CRUD.put("user/update-avatar", body, token);

const deletePicture = (urlS3: string, token: string) => {
  const fileKey = urlS3.replace(REACT_NATIVE_S3_URL, "");
  _CRUD.delete(`user/delete-avatar/${fileKey}`, token);
};

export default { postPicture: putPicture, deletePicture };
