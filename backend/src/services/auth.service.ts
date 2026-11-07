import { userModel, UserRecord } from "../models/user.model";
import { generateToken } from "../utils/generateToken";
import { ApiError } from "../utils/ApiError";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import {
  LoginInput,
  RegisterInput,
  UpdateProfileInput,
} from "../validators/auth.validator";

export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  role: UserRecord["role"];
  createdAt: string;
}

function toSafeUser(user: UserRecord): SafeUser {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userModel.findByEmail(input.email);

    if (existing) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const user = await userModel.create({
      fullName: input.fullName,
      email: input.email,
      password: await hashPassword(input.password),
      role: input.role,
    });

    return {
      user: toSafeUser(user),
      token: generateToken(user.id, user.email, user.role),
    };
  },

  async login(input: LoginInput) {
    const user = await userModel.findByEmail(input.email);

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const valid = await comparePassword(input.password, user.password);

    if (!valid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    return {
      user: toSafeUser(user),
      token: generateToken(user.id, user.email, user.role),
    };
  },

  async getProfile(id: string): Promise<SafeUser> {
    const user = await userModel.findById(id);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return toSafeUser(user);
  },

  async updateProfile(
    id: string,
    input: UpdateProfileInput,
  ): Promise<SafeUser> {
    if (input.email) {
      const existing = await userModel.findByEmail(input.email);

      if (existing && existing.id !== id) {
        throw ApiError.conflict("An account with this email already exists");
      }
    }

    const fields: Partial<{
      fullName: string;
      email: string;
      password: string;
    }> = {
      fullName: input.fullName,
      email: input.email,
    };

    if (input.password) {
      fields.password = await hashPassword(input.password);
    }

    const user = await userModel.update(id, fields);

    if (!user) {
      throw ApiError.notFound("User not found");
    }

    return toSafeUser(user);
  },

  async listUsers(): Promise<SafeUser[]> {
    const users = await userModel.list();
    return users.map(toSafeUser);
  },
};
