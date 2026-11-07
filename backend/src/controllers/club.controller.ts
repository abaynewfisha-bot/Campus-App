import { Request, Response } from "express";
import { clubService } from "../services/club.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listClubs = asyncHandler(async (req: Request, res: Response) => {
  const result = await clubService.list(req.query);
  res.status(200).json({ success: true, ...result });
});

export const getClub = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubService.get(String(req.params.id));
  res.status(200).json({ success: true, data: club });
});

export const createClub = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubService.create(req.body);
  res.status(201).json({ success: true, data: club });
});

export const updateClub = asyncHandler(async (req: Request, res: Response) => {
  const club = await clubService.update(String(req.params.id), req.body);
  res.status(200).json({ success: true, data: club });
});

export const deleteClub = asyncHandler(async (req: Request, res: Response) => {
  await clubService.remove(String(req.params.id));
  res.status(200).json({ success: true, message: "Club deleted" });
});
