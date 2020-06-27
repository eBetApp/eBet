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
  post: async (endPoint: string, body: FormData | string, token?: string) => {
    const headers = {};
    if (token !== null) headers["Authorization"] = `Bearer ${token}`;
    if (typeof body === "string")
      headers["Content-Type"] = "application/x-www-form-urlencoded";

    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "POST",
        headers,
        body,
      });
      return response.json();
    } catch (err) {
      throw err;
    }
  },
  put: async (endPoint: string, body: FormData | string, token?: string) => {
    const headers = {};
    if (token !== null) headers["Authorization"] = `Bearer ${token}`;
    if (typeof body === "string")
      headers["Content-Type"] = "application/x-www-form-urlencoded";

    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "PUT",
        headers,
        body,
      });
      const json = await response.json();
      return json;
    } catch (err) {
      throw err;
    }
  },
  get: async (endPoint: string, body: FormData, token: string) => {
    try {
      let response = await fetch(`${REACT_NATIVE_BACK_URL}/api/${endPoint}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
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

export default {
  postPicture: putPicture,
  deletePicture,
  post: _CRUD.post,
  put: _CRUD.put,
};
