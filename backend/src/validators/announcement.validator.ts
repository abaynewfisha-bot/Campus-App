import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(5),
  category: z.string().trim().min(2).max(60).default("general"),
});

export const updateAnnouncementSchema = createAnnouncementSchema.partial();

export type CreateAnnouncementInput = z.infer<typeof createAnnouncementSchema>;
export type UpdateAnnouncementInput = z.infer<typeof updateAnnouncementSchema>;
