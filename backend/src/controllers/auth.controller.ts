import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, data: result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(200).json({ success: true, data: result });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.getProfile(req.user!.id);
  res.status(200).json({ success: true, data: user });
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ success: true, data: user });
  },
);

export const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await authService.listUsers();
  res.status(200).json({ success: true, data: users });
});
