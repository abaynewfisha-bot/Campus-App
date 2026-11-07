import { pool } from "../config/db";
import { PaginationParams } from "../types";
import { buildUpdate } from "../utils/buildUpdate";

export interface EventRecord {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  organizerId: string | null;
  createdAt: string;
}

const SELECT_FIELDS = `id, title, description, location, category, start_date AS "startDate", end_date AS "endDate", organizer_id AS "organizerId", created_at AS "createdAt"`;

interface ListOptions extends PaginationParams {
  search?: string;
  category?: string;
  upcoming?: boolean;
}

export const eventModel = {
  async findAll(options: ListOptions): Promise<{
    rows: EventRecord[];
    total: number;
  }> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (options.search) {
      values.push(`%${options.search}%`);
      conditions.push(
        `(title ILIKE $${values.length} OR description ILIKE $${values.length} OR location ILIKE $${values.length})`,
      );
    }

    if (options.category) {
      values.push(options.category);
      conditions.push(`category = $${values.length}`);
    }

    if (options.upcoming) {
      conditions.push(`end_date >= NOW()`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM events ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM events ${where}
       ORDER BY start_date ASC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as EventRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<EventRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM events WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as EventRecord | undefined) ?? null;
  },

  async create(input: {
    title: string;
    description: string;
    location: string;
    category: string;
    startDate: string;
    endDate: string;
    organizerId: string;
  }): Promise<EventRecord> {
    const result = await pool.query(
      `INSERT INTO events (title, description, location, category, start_date, end_date, organizer_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${SELECT_FIELDS}`,
      [
        input.title,
        input.description,
        input.location,
        input.category,
        input.startDate,
        input.endDate,
        input.organizerId,
      ],
    );
    return result.rows[0] as EventRecord;
  },

  async update(
    id: string,
    fields: Partial<{
      title: string;
      description: string;
      location: string;
      category: string;
      startDate: string;
      endDate: string;
    }>,
  ): Promise<EventRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      title: "title",
      description: "description",
      location: "location",
      category: "category",
      startDate: "start_date",
      endDate: "end_date",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE events SET ${setClause} WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as EventRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM events WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
