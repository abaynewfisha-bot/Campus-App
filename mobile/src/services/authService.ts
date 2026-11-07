import {
  AuthResult,
  RegisterInput,
  UpdateProfileInput,
  User,
} from "../types";
import { apiClient } from "./apiClient";

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const response = await apiClient.post("/auth/register", input);
    return response.data.data as AuthResult;
  },

  async login(email: string, password: string): Promise<AuthResult> {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data.data as AuthResult;
  },

  async getProfile(): Promise<User> {
    const response = await apiClient.get("/auth/profile");
    return response.data.data as User;
  },

  async updateProfile(input: UpdateProfileInput): Promise<User> {
    const response = await apiClient.put("/auth/profile", input);
    return response.data.data as User;
  },

  async listUsers(): Promise<User[]> {
    const response = await apiClient.get("/auth/users");
    return response.data.data as User[];
  },
};
