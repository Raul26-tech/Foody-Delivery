import { api } from "../../../service/api";
import type {
  AuthenticatedUser,
  LoginRequest,
  RegisterRequest,
} from "../types";

export async function initializeCsrf(): Promise<void> {
  await api.get("/auth/csrf");
}

export async function sendRegisterRequest(
  payload: RegisterRequest,
): Promise<AuthenticatedUser> {
  const response = await api.post<AuthenticatedUser>("/auth/register", payload);

  return response.data;
}

export async function sendLoginRequest(
  payload: LoginRequest,
): Promise<AuthenticatedUser> {
  const response = await api.post<AuthenticatedUser>("/auth/login", payload);

  return response.data;
}

export async function fetchCurrentUser(): Promise<AuthenticatedUser> {
  const response = await api.get<AuthenticatedUser>("/auth/me");

  return response.data;
}

export async function sendLogoutRequest(): Promise<void> {
  await api.post("/auth/logout");
}
