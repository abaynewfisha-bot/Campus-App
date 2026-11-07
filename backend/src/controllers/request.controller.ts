import { Request, Response } from "express";
import { requestService } from "../services/request.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await requestService.list(req.query, req.user!);
    res.status(200).json({ success: true, ...result });
  },
);

export const getRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await requestService.get(String(req.params.id), req.user!);
  res.status(200).json({ success: true, data: request });
});

export const createRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const request = await requestService.create(req.body, req.user!);
    res.status(201).json({ success: true, data: request });
  },
);

export const updateRequestStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const request = await requestService.updateStatus(
      String(req.params.id),
      req.body.status,
    );
    res.status(200).json({ success: true, data: request });
  },
);

export const deleteRequest = asyncHandler(
  async (req: Request, res: Response) => {
    await requestService.remove(String(req.params.id), req.user!);
    res.status(200).json({ success: true, message: "Service request deleted" });
  },
);
