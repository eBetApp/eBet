interface ISignInPayload {
  email: string;
  password: string;
}

interface ISignUpPayload {
  nickname: string;
  email: string;
  password: string;
  birthdate: string;
}

interface IPwdUpdatePayload {
  uuid: string;
  currentPwd: string;
  newPwd: string;
}
