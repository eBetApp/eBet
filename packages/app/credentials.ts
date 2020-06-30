// .env imports
import { REACT_NATIVE_STRIPE_PK } from "react-native-dotenv";
import { REACT_NATIVE_BACK_URL } from "react-native-dotenv";
import { REACT_NATIVE_S3_URL } from "react-native-dotenv";

console.log("####### CHECK .env (throw if incomplete) #######");
console.log(`## ${REACT_NATIVE_STRIPE_PK.toString()} --> OK`);
console.log(`## ${REACT_NATIVE_BACK_URL.toString()} --> OK`);
console.log(`## ${REACT_NATIVE_S3_URL.toString()} --> OK`);
