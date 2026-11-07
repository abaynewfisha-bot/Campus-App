import { Request, Response } from "express";
import { eventService } from "../services/event.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listEvents = asyncHandler(async (req: Request, res: Response) => {
  const result = await eventService.list(req.query);
  res.status(200).json({ success: true, ...result });
});

export const getEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.get(String(req.params.id));
  res.status(200).json({ success: true, data: event });
});

export const createEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.create(req.body, req.user!.id);
  res.status(201).json({ success: true, data: event });
});

export const updateEvent = asyncHandler(async (req: Request, res: Response) => {
  const event = await eventService.update(String(req.params.id), req.body);
  res.status(200).json({ success: true, data: event });
});

export const deleteEvent = asyncHandler(async (req: Request, res: Response) => {
  await eventService.remove(String(req.params.id));
  res.status(200).json({ success: true, message: "Event deleted" });
});
