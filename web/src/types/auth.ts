export type User = {
  id: number;
  email: string;
}

export type AuthCredentials = {
  email: string;
  password: string;
}

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
}
