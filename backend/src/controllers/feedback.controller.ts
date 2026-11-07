import { Request, Response } from "express";
import { feedbackService } from "../services/feedback.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await feedbackService.list(req.query, req.user!);
    res.status(200).json({ success: true, ...result });
  },
);

export const getFeedback = asyncHandler(async (req: Request, res: Response) => {
  const entry = await feedbackService.get(String(req.params.id), req.user!);
  res.status(200).json({ success: true, data: entry });
});

export const createFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const entry = await feedbackService.create(req.body, req.user!);
    res.status(201).json({ success: true, data: entry });
  },
);

export const updateFeedbackStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const entry = await feedbackService.updateStatus(
      String(req.params.id),
      req.body.status,
    );
    res.status(200).json({ success: true, data: entry });
  },
);

export const deleteFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    await feedbackService.remove(String(req.params.id), req.user!);
    res.status(200).json({ success: true, message: "Feedback deleted" });
  },
);
