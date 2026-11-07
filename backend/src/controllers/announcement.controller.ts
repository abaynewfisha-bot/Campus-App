import { Request, Response } from "express";
import { announcementService } from "../services/announcement.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listAnnouncements = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await announcementService.list(req.query);
    res.status(200).json({ success: true, ...result });
  },
);

export const getAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    const announcement = await announcementService.get(String(req.params.id));
    res.status(200).json({ success: true, data: announcement });
  },
);

export const createAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    const announcement = await announcementService.create(
      req.body,
      req.user!.id,
    );
    res.status(201).json({ success: true, data: announcement });
  },
);

export const updateAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    const announcement = await announcementService.update(
      String(req.params.id),
      req.body,
    );
    res.status(200).json({ success: true, data: announcement });
  },
);

export const deleteAnnouncement = asyncHandler(
  async (req: Request, res: Response) => {
    await announcementService.remove(String(req.params.id));
    res.status(200).json({ success: true, message: "Announcement deleted" });
  },
);
