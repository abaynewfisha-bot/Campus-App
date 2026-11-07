import { z } from "zod";

const dateString = z
  .string()
  .refine((value) => !Number.isNaN(Date.parse(value)), "Invalid date");

export const createEventSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    description: z.string().trim().min(5),
    location: z.string().trim().min(2).max(200),
    category: z.string().trim().min(2).max(60).default("general"),
    startDate: dateString,
    endDate: dateString,
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after the start date",
    path: ["endDate"],
  });

export const updateEventSchema = z
  .object({
    title: z.string().trim().min(3).max(200).optional(),
    description: z.string().trim().min(5).optional(),
    location: z.string().trim().min(2).max(200).optional(),
    category: z.string().trim().min(2).max(60).optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
