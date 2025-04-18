export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}
