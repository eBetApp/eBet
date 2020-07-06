import AsyncStorage from "@react-native-community/async-storage";

export enum localStorageItems {
  token = "token",
  userUuid = "uuid",
}

export const setStorage = async (key, json) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(json));
  } catch (e) {
    console.log(`setStorage() error: ${e.message}`);
  }
};

export const readStorageKey = async (key): Promise<string | undefined> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const res = JSON.parse(value);
      return res;
    }
  } catch (e) {
    console.log(`readStorageKey(${key}) error: ${e.message}`);
  }
};

export const removeStorageKey = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.log(`removeStorage(${key}) error: ${e.message}`);
  }
};
export const removeFullStorage = async () => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    await AsyncStorage.multiRemove(allKeys);
  } catch (e) {
    console.log("removeFullStorage() error: ${e.message}");
  }
};
