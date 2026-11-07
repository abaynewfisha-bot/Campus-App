import { z } from "zod";

export const createFeedbackSchema = z.object({
  subject: z.string().trim().min(3).max(200),
  description: z.string().trim().min(5),
  category: z.string().trim().min(2).max(60),
});

export const updateFeedbackStatusSchema = z.object({
  status: z.enum(["pending", "reviewed", "resolved", "rejected"]),
});

export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type UpdateFeedbackStatusInput = z.infer<
  typeof updateFeedbackStatusSchema
>;
