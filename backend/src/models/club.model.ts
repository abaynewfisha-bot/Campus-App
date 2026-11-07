import { pool } from "../config/db";
import { PaginationParams } from "../types";
import { buildUpdate } from "../utils/buildUpdate";

export interface ClubRecord {
  id: string;
  name: string;
  description: string;
  contactEmail: string;
  imageUrl: string | null;
  activities: string | null;
  createdAt: string;
}

const SELECT_FIELDS = `id, name, description, contact_email AS "contactEmail", image_url AS "imageUrl", activities, created_at AS "createdAt"`;

interface ListOptions extends PaginationParams {
  search?: string;
}

export const clubModel = {
  async findAll(options: ListOptions): Promise<{
    rows: ClubRecord[];
    total: number;
  }> {
    const conditions: string[] = [];
    const values: unknown[] = [];

    if (options.search) {
      values.push(`%${options.search}%`);
      conditions.push(
        `(name ILIKE $${values.length} OR description ILIKE $${values.length})`,
      );
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM clubs ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM clubs ${where}
       ORDER BY name ASC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as ClubRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<ClubRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM clubs WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as ClubRecord | undefined) ?? null;
  },

  async create(input: {
    name: string;
    description: string;
    contactEmail: string;
    imageUrl?: string;
    activities?: string;
  }): Promise<ClubRecord> {
    const result = await pool.query(
      `INSERT INTO clubs (name, description, contact_email, image_url, activities)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${SELECT_FIELDS}`,
      [
        input.name,
        input.description,
        input.contactEmail,
        input.imageUrl || null,
        input.activities || null,
      ],
    );
    return result.rows[0] as ClubRecord;
  },

  async update(
    id: string,
    fields: Partial<{
      name: string;
      description: string;
      contactEmail: string;
      imageUrl: string;
      activities: string;
    }>,
  ): Promise<ClubRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      name: "name",
      description: "description",
      contactEmail: "contact_email",
      imageUrl: "image_url",
      activities: "activities",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE clubs SET ${setClause} WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as ClubRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM clubs WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
