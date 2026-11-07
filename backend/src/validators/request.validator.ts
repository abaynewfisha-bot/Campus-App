import { z } from "zod";

export const createRequestSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(5),
  category: z.string().trim().min(2).max(60),
  location: z.string().trim().max(200).optional(),
});

export const updateRequestStatusSchema = z.object({
  status: z.enum(["pending", "in_progress", "resolved", "rejected"]),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<
  typeof updateRequestStatusSchema
>;
