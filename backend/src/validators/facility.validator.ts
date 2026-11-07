import { z } from "zod";

export const createFacilitySchema = z.object({
  name: z.string().trim().min(2).max(160),
  category: z.string().trim().min(2).max(60).default("general"),
  description: z.string().trim().min(5),
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  contact: z.string().trim().max(120).optional(),
});

export const updateFacilitySchema = createFacilitySchema.partial();

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
