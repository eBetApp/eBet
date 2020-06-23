export enum errorType {
  nickname = "nickname",
  email = "email",
  password = "password",
  birthdate = "birthdate",
}

export function classifyError(errorMessage: string): errorType {
  if (errorMessage.includes(errorType.nickname)) return errorType.nickname;
  if (errorMessage.includes(errorType.email)) return errorType.email;
  if (errorMessage.includes(errorType.password)) return errorType.password;
  if (errorMessage.includes(errorType.birthdate)) return errorType.birthdate;
  return null;
}
