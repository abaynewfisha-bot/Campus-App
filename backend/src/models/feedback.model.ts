import { pool } from "../config/db";
import { FeedbackStatus, PaginationParams } from "../types";

export interface FeedbackRecord {
  id: string;
  userId: string;
  subject: string;
  description: string;
  category: string;
  status: FeedbackStatus;
  createdAt: string;
  updatedAt: string;
}

const SELECT_FIELDS = `id, user_id AS "userId", subject, description, category, status, created_at AS "createdAt", updated_at AS "updatedAt"`;

interface ListOptions extends PaginationParams {
  userId?: string;
  status?: string;
  search?: string;
}

export const feedbackModel = {
  async findAll(options: ListOptions): Promise<{
    rows: FeedbackRecord[];
    total: number;
  }> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (options.userId) {
      values.push(options.userId);
      conditions.push(`user_id = $${values.length}`);
    }

    if (options.status) {
      values.push(options.status);
      conditions.push(`status = $${values.length}`);
    }

    if (options.search) {
      values.push(`%${options.search}%`);
      conditions.push(
        `(subject ILIKE $${values.length} OR description ILIKE $${values.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM feedback ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM feedback ${where}
       ORDER BY created_at DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as FeedbackRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<FeedbackRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM feedback WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as FeedbackRecord | undefined) ?? null;
  },

  async create(input: {
    userId: string;
    subject: string;
    description: string;
    category: string;
  }): Promise<FeedbackRecord> {
    const result = await pool.query(
      `INSERT INTO feedback (user_id, subject, description, category)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_FIELDS}`,
      [input.userId, input.subject, input.description, input.category],
    );
    return result.rows[0] as FeedbackRecord;
  },

  async updateStatus(
    id: string,
    status: FeedbackStatus,
  ): Promise<FeedbackRecord | null> {
    const result = await pool.query(
      `UPDATE feedback SET status = $1, updated_at = NOW() WHERE id = $2
       RETURNING ${SELECT_FIELDS}`,
      [status, id],
    );
    return (result.rows[0] as FeedbackRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM feedback WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
