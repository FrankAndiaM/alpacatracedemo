export type RegisterPerson = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  password: string;
};

export type UserCognitoParams = {
  name: string;
  lastName: string;
  phone: string;
  email: string;
  dni: string;
  password: string;
  verifyPassword: string;
};

export type CognitoCredentials = {
  username: string;
  password?: string;
  verifyCode?: string;
  newPassword?: string;
  verifyNewPassword?: string;
};

export type CognitoChangePassword = {
  oldPassword: string;
  newPassword: string;
  verifyNewPassword: string;
};

export type CognitoForgotPassword = {
  username: string;
  newPassword: string;
  verificationCode: string;
};
