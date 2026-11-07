import { pool } from "../config/db";
import { PaginationParams, RequestStatus } from "../types";

export interface ServiceRequestRecord {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
}

const SELECT_FIELDS = `id, user_id AS "userId", title, description, category, location, status, created_at AS "createdAt", updated_at AS "updatedAt"`;

interface ListOptions extends PaginationParams {
  userId?: string;
  status?: string;
  search?: string;
}

export const serviceRequestModel = {
  async findAll(options: ListOptions): Promise<{
    rows: ServiceRequestRecord[];
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
        `(title ILIKE $${values.length} OR description ILIKE $${values.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM service_requests ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM service_requests ${where}
       ORDER BY created_at DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as ServiceRequestRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<ServiceRequestRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM service_requests WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as ServiceRequestRecord | undefined) ?? null;
  },

  async create(input: {
    userId: string;
    title: string;
    description: string;
    category: string;
    location?: string;
  }): Promise<ServiceRequestRecord> {
    const result = await pool.query(
      `INSERT INTO service_requests (user_id, title, description, category, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${SELECT_FIELDS}`,
      [
        input.userId,
        input.title,
        input.description,
        input.category,
        input.location || null,
      ],
    );
    return result.rows[0] as ServiceRequestRecord;
  },

  async updateStatus(
    id: string,
    status: RequestStatus,
  ): Promise<ServiceRequestRecord | null> {
    const result = await pool.query(
      `UPDATE service_requests
       SET status = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING ${SELECT_FIELDS}`,
      [status, id],
    );
    return (result.rows[0] as ServiceRequestRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM service_requests WHERE id = $1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
