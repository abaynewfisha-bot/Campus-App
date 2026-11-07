import { pool } from "../config/db";
import { PaginationParams } from "../types";
import { buildUpdate } from "../utils/buildUpdate";

export interface FacilityRecord {
  id: string;
  name: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  contact: string | null;
  createdAt: string;
}

const SELECT_FIELDS = `id, name, category, description, latitude, longitude, contact, created_at AS "createdAt"`;

interface ListOptions extends PaginationParams {
  search?: string;
  category?: string;
}

export const facilityModel = {
  async findAll(options: ListOptions): Promise<{
    rows: FacilityRecord[];
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

    if (options.category) {
      values.push(options.category);
      conditions.push(`category = $${values.length}`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(
      `SELECT COUNT(*)::int AS total FROM facilities ${where}`,
      values,
    );

    const listValues = [...values, options.limit, options.offset];
    const listResult = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM facilities ${where}
       ORDER BY name ASC
       LIMIT $${listValues.length - 1} OFFSET $${listValues.length}`,
      listValues,
    );

    return {
      rows: listResult.rows as FacilityRecord[],
      total: countResult.rows[0].total as number,
    };
  },

  async findById(id: string): Promise<FacilityRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM facilities WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as FacilityRecord | undefined) ?? null;
  },

  async create(input: {
    name: string;
    category: string;
    description: string;
    latitude: number;
    longitude: number;
    contact?: string;
  }): Promise<FacilityRecord> {
    const result = await pool.query(
      `INSERT INTO facilities (name, category, description, latitude, longitude, contact)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${SELECT_FIELDS}`,
      [
        input.name,
        input.category,
        input.description,
        input.latitude,
        input.longitude,
        input.contact || null,
      ],
    );
    return result.rows[0] as FacilityRecord;
  },

  async update(
    id: string,
    fields: Partial<{
      name: string;
      category: string;
      description: string;
      latitude: number;
      longitude: number;
      contact: string;
    }>,
  ): Promise<FacilityRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      name: "name",
      category: "category",
      description: "description",
      latitude: "latitude",
      longitude: "longitude",
      contact: "contact",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE facilities SET ${setClause} WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as FacilityRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(`DELETE FROM facilities WHERE id = $1`, [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  },
};
