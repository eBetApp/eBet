export enum errorType {
  nickname = "nickname",
  email = "email",
  password = "password",
  birthdate = "birthdate",
}

export function classifyError(errorMessage: string): errorType {
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
