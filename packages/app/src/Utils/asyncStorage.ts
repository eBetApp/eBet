import AsyncStorage from "@react-native-community/async-storage";

const setStorage = async (key, json) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(json));
  } catch (error) {
    console.log(error.message);
  }
};

const readStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      const res = JSON.parse(value);
      console.log("READ SUCCESSFULLY");
      console.log(res);
      return res
    }
  } catch (e) {
    console.log(e.message);
  }
  console.log("STORAGE READ")
};

const removeStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch(e) {
    console.log(e.message)
  }
  console.log('Done.')
}

export { setStorage, readStorage, removeStorage };
