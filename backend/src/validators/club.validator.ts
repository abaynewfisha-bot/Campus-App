import { z } from "zod";

export const createClubSchema = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().min(5),
  contactEmail: z.string().trim().toLowerCase().email(),
  imageUrl: z.string().trim().url().optional().or(z.literal("")),
  activities: z.string().trim().max(2000).optional(),
});

export const updateClubSchema = createClubSchema.partial();

export type CreateClubInput = z.infer<typeof createClubSchema>;
export type UpdateClubInput = z.infer<typeof updateClubSchema>;
