import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(200),
  message: z.string().trim().min(2),
  broadcast: z.boolean().optional().default(false),
});

export type CreateNotificationInput = z.infer<
  typeof createNotificationSchema
>;
