import { pool } from "../config/db";
import { PaginationParams, UserRole } from "../types";

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const SELECT_FIELDS = `id, user_id AS "userId", title, message, is_read AS "isRead", created_at AS "createdAt"`;

interface ListOptions extends PaginationParams {
  userId: string;
  unreadOnly?: boolean;
}

export const notificationModel = {
  async findAll(options: ListOptions): Promise<{
    rows: NotificationRecord[];
    total: number;
    unread: number;
  }> {
    const values: unknown[] = [options.userId];
    const conditions = [`user_id = $1`];

    if (options.unreadOnly) {
      conditions.push(`is_read = FALSE`);
    }

    const where = `WHERE ${conditions.join(" AND ")}`;

    const countResult = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE is_read = FALSE)::int AS unread
       FROM notifications WHERE user_id = $1`,
      [options.userId],
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM notifications ${where}
       ORDER BY created_at DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as NotificationRecord[],
      total: countResult.rows[0].total as number,
      unread: countResult.rows[0].unread as number,
    };
  },

  async create(input: {
    userId: string;
    title: string;
    message: string;
  }): Promise<NotificationRecord | null> {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message)
       SELECT id, $2, $3 FROM users
       WHERE id = $1 AND role IN ('student', 'staff')
       RETURNING ${SELECT_FIELDS}`,
      [input.userId, input.title, input.message],
    );
    return (result.rows[0] as NotificationRecord | undefined) ?? null;
  },

  async createForRole(input: {
    title: string;
    message: string;
    role: Extract<UserRole, "student" | "staff">;
  }): Promise<number> {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message)
       SELECT id, $1, $2 FROM users WHERE role = $3`,
      [input.title, input.message, input.role],
    );
    return result.rowCount ?? 0;
  },

  async createForStudentsAndStaff(input: {
    title: string;
    message: string;
  }): Promise<number> {
    const result = await pool.query(
      `INSERT INTO notifications (user_id, title, message)
       SELECT id, $1, $2 FROM users WHERE role IN ('student', 'staff')`,
      [input.title, input.message],
    );
    return result.rowCount ?? 0;
  },

  async markAsRead(
    id: string,
    userId: string,
  ): Promise<NotificationRecord | null> {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE id = $1 AND user_id = $2
       RETURNING ${SELECT_FIELDS}`,
      [id, userId],
    );
    return (result.rows[0] as NotificationRecord | undefined) ?? null;
  },

  async markAllAsRead(userId: string): Promise<number> {
    const result = await pool.query(
      `UPDATE notifications SET is_read = TRUE
       WHERE user_id = $1 AND is_read = FALSE`,
      [userId],
    );
    return result.rowCount ?? 0;
  },

  async remove(id: string, userId: string): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM notifications WHERE id = $1 AND user_id = $2`,
      [id, userId],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
