import { pool } from "../config/db";
import { UserRole } from "../types";
import { buildUpdate } from "../utils/buildUpdate";

export interface UserRecord {
  id: string;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: string;
}

const SELECT_FIELDS = `id, full_name AS "fullName", email, password, role, created_at AS "createdAt"`;

export const userModel = {
  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM users WHERE email = $1`,
      [email],
    );
    return (result.rows[0] as UserRecord | undefined) ?? null;
  },

  async findById(id: string): Promise<UserRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM users WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as UserRecord | undefined) ?? null;
  },

  async create(input: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
  }): Promise<UserRecord> {
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_FIELDS}`,
      [input.fullName, input.email, input.password, input.role],
    );
    return result.rows[0] as UserRecord;
  },

  async update(
    id: string,
    fields: Partial<{ fullName: string; email: string; password: string }>,
  ): Promise<UserRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      fullName: "full_name",
      email: "email",
      password: "password",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as UserRecord | undefined) ?? null;
  },

  async list(): Promise<UserRecord[]> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM users ORDER BY created_at DESC`,
    );
    return result.rows as UserRecord[];
  },
};
