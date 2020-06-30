// import { FullTheme } from "react-native-elements";

// ENTITIES
interface User {
  uuid: string;
  nickname: string;
  email: string;
  birthdate: string;
  password: string;
  avatar?: string;
  customerId?: string;
  accountId?: string;
}

interface IErrorBase {
  status: number;
  name: string;
  message: string;
  details?: any;
  stack?: string;
}

// SERVER RESPONSES
interface IApiResponseSuccess {
  status: number;
  data: { [key: string]: any };
}

interface IApiResponseError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

/** Format of all responses except these returning user */
type ApiResponse = IApiResponseSuccess | IApiResponseError;

interface IToken {
  token: string;
}
/** Authentication Responses returning user with token */
interface IAuthServiceResponse extends IApiResponseSuccess {
  status: number;
  data: {
    user: Omit<User, "password">;
  };
  meta: IToken;
}

/** Responses (when logged) returning user */
interface IUserServiceResponse extends IApiResponseSuccess {
  status: number;
  data: {
    user?: Omit<User, "password">;
  };
}
