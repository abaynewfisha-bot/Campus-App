import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { JwtPayload, UserRole } from "../types";

export function generateToken(
  id: string,
  email: string,
  role: UserRole,
): string {
  const payload: JwtPayload = { sub: id, email, role };
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
}
