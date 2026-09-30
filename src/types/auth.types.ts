// Backend (PrepPilotBackend) ke response shapes

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponseData {
  user: User;
  token: string;
}
