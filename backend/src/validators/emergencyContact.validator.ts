import { z } from "zod";

export const createEmergencyContactSchema = z.object({
  department: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(3).max(40),
  description: z.string().trim().max(1000).optional(),
});

export const updateEmergencyContactSchema =
  createEmergencyContactSchema.partial();

export type CreateEmergencyContactInput = z.infer<
  typeof createEmergencyContactSchema
>;
export type UpdateEmergencyContactInput = z.infer<
  typeof updateEmergencyContactSchema
>;
