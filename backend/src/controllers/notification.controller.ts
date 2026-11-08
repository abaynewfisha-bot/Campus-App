import { Request, Response } from "express";
import { notificationService } from "../services/notification.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await notificationService.list(req.query, req.user!.id);
    res.status(200).json({ success: true, ...result });
  },
);

export const createNotification = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await notificationService.create(req.body);
    res.status(201).json({ success: true, data: result });
  },
);

export const messageAdmins = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await notificationService.messageAdmins(req.body, req.user!);
    res.status(201).json({ success: true, data: result });
  },
);

export const markNotificationRead = asyncHandler(
  async (req: Request, res: Response) => {
    const notification = await notificationService.markAsRead(
      String(req.params.id),
      req.user!.id,
    );
    res.status(200).json({ success: true, data: notification });
  },
);

export const markAllNotificationsRead = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await notificationService.markAllAsRead(req.user!.id);
    res.status(200).json({ success: true, data: result });
  },
);

export const deleteNotification = asyncHandler(
  async (req: Request, res: Response) => {
    await notificationService.remove(String(req.params.id), req.user!.id);
    res.status(200).json({ success: true, message: "Notification deleted" });
  },
);
