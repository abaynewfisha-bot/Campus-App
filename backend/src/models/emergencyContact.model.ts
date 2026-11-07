import { pool } from "../config/db";
import { buildUpdate } from "../utils/buildUpdate";

export interface EmergencyContactRecord {
  id: string;
  department: string;
  phone: string;
  description: string | null;
  createdAt: string;
}

const SELECT_FIELDS = `id, department, phone, description, created_at AS "createdAt"`;

export const emergencyContactModel = {
  async findAll(): Promise<EmergencyContactRecord[]> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM emergency_contacts ORDER BY department ASC`,
    );
    return result.rows as EmergencyContactRecord[];
  },

  async findById(id: string): Promise<EmergencyContactRecord | null> {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM emergency_contacts WHERE id = $1`,
      [id],
    );
    return (result.rows[0] as EmergencyContactRecord | undefined) ?? null;
  },

  async create(input: {
    department: string;
    phone: string;
    description?: string;
  }): Promise<EmergencyContactRecord> {
    const result = await pool.query(
      `INSERT INTO emergency_contacts (department, phone, description)
       VALUES ($1, $2, $3)
       RETURNING ${SELECT_FIELDS}`,
      [input.department, input.phone, input.description || null],
    );
    return result.rows[0] as EmergencyContactRecord;
  },

  async update(
    id: string,
    fields: Partial<{
      department: string;
      phone: string;
      description: string;
    }>,
  ): Promise<EmergencyContactRecord | null> {
    const { setClause, values, nextIndex } = buildUpdate(fields, {
      department: "department",
      phone: "phone",
      description: "description",
    });

    if (!setClause) {
      return this.findById(id);
    }

    const result = await pool.query(
      `UPDATE emergency_contacts SET ${setClause} WHERE id = $${nextIndex}
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    return (result.rows[0] as EmergencyContactRecord | undefined) ?? null;
  },

  async remove(id: string): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM emergency_contacts WHERE id = $1`,
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
