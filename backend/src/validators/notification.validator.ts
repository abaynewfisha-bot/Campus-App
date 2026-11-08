import { z } from "zod";

export const createNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(200),
  message: z.string().trim().min(2),
  broadcastRole: z.enum(["student", "staff"]).optional(),
  broadcast: z.boolean().optional(),
}).refine(
  (input) =>
    Number(Boolean(input.userId)) +
      Number(Boolean(input.broadcastRole)) +
      Number(Boolean(input.broadcast)) ===
    1,
  "Choose one user, one role, or all students and staff",
);

export type CreateNotificationInput = z.infer<
  typeof createNotificationSchema
>;
