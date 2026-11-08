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

export const createAdminMessageSchema = z.object({
  title: z.string().trim().min(2).max(200),
  message: z.string().trim().min(2).max(5000),
});

export type CreateNotificationInput = z.infer<
  typeof createNotificationSchema
>;
export type CreateAdminMessageInput = z.infer<
  typeof createAdminMessageSchema
>;
