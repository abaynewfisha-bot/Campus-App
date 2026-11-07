import { Request, Response } from "express";
import { emergencyContactService } from "../services/emergencyContact.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listEmergencyContacts = asyncHandler(
  async (_req: Request, res: Response) => {
    const contacts = await emergencyContactService.list();
    res.status(200).json({ success: true, data: contacts });
  },
);

export const getEmergencyContact = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await emergencyContactService.get(String(req.params.id));
    res.status(200).json({ success: true, data: contact });
  },
);

export const createEmergencyContact = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await emergencyContactService.create(req.body);
    res.status(201).json({ success: true, data: contact });
  },
);

export const updateEmergencyContact = asyncHandler(
  async (req: Request, res: Response) => {
    const contact = await emergencyContactService.update(
      String(req.params.id),
      req.body,
    );
    res.status(200).json({ success: true, data: contact });
  },
);

export const deleteEmergencyContact = asyncHandler(
  async (req: Request, res: Response) => {
    await emergencyContactService.remove(String(req.params.id));
    res.status(200).json({ success: true, message: "Emergency contact deleted" });
  },
);
