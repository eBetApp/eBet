import AsyncStorage from "@react-native-community/async-storage";

export enum localStorageItems {
  token = "token",
}

export const setStorage = async (key, json) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(json));
  } catch (e) {
    console.log(`setStorage() error: ${e.message}`);
  }
};

export const readStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const res = JSON.parse(value);
      return res;
    }
  } catch (e) {
    console.log(`readStorage() error: ${e.message}`);
  }
};

export const removeStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`removeStorage() error: ${e.message}`);
  }
};
