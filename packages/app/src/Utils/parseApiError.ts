export enum errorType {
  nickname = "nickname",
  email = "email",
  password = "password",
  birthdate = "birthdate",
}

export function classifyAuthError(errorMessage: string): errorType {
  if (errorMessage.toLowerCase().includes(errorType.nickname))
    return errorType.nickname;
  if (errorMessage.toLowerCase().includes(errorType.email))
    return errorType.email;
  if (errorMessage.toLowerCase().includes(errorType.password))
    return errorType.password;
  if (errorMessage.toLowerCase().includes(errorType.birthdate))
    return errorType.birthdate;
  return null;
}

export class AuthError {
  [errorType.nickname]: string = "";
  [errorType.email]: string = "";
  [errorType.birthdate]: string = "";
  [errorType.password]: string = "";

  constructor(params?: {
    nickname?: string;
    email?: string;
    birthdate?: string;
    password?: string;
  }) {
    this.nickname = params?.nickname ?? "";
    this.email = params?.email ?? "";
    this.birthdate = params?.birthdate ?? "";
    this.password = params?.password ?? "";
  }
}
