import { pool } from "../config/db";
import { PaginationParams } from "../types";
import { buildUpdate } from "../utils/buildUpdate";

export interface AnnouncementRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  authorId: string | null;
  createdAt: string;
  updatedAt: string;
}

const SELECT_FIELDS = `id, title, description, category, author_id AS "authorId", created_at AS "createdAt", updated_at AS "updatedAt"`;

interface ListOptions extends PaginationParams {
  search?: string;
  category?: string;
}

export const announcementModel = {
  async findAll(options: ListOptions): Promise<{
    rows: AnnouncementRecord[];
    total: number;
  }> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (options.search) {
      values.push(`%${options.search}%`);
      conditions.push(
        `(title ILIKE $${values.length} OR description ILIKE $${values.length})`,
      );
    }

    if (options.category) {
      values.push(options.category);
      conditions.push(`category = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM announcements ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM announcements ${where}
       ORDER BY created_at DESC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as AnnouncementRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<AnnouncementRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM announcements WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as AnnouncementRecord | undefined) ?? null;
  },

  async create(input: {
    title: string;
    description: string;
    category: string;
    authorId: string;
  }): Promise<AnnouncementRecord> {
    const result = await pool.query(
      `INSERT INTO announcements (title, description, category, author_id)
       VALUES ($1, $2, $3, $4)
       RETURNING ${SELECT_FIELDS}`,
      [input.title, input.description, input.category, input.authorId],
    );
    return result.rows[0] as AnnouncementRecord;
  },

  async update(
    id: string,
    fields: Partial<{ title: string; description: string; category: string }>,
  ): Promise<AnnouncementRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      title: "title",
      description: "description",
      category: "category",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE announcements
       SET ${setClause}, updated_at = NOW()
       WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as AnnouncementRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM announcements WHERE id = $1`, [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  },
};
