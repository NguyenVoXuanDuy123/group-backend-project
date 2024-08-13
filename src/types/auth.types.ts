export type RegisterRequestType = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequestType = {
  username: string;
  password: string;
};
