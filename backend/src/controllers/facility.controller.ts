import { Request, Response } from "express";
import { facilityService } from "../services/facility.service";
import { asyncHandler } from "../utils/asyncHandler";

export const listFacilities = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await facilityService.list(req.query);
    res.status(200).json({ success: true, ...result });
  },
);

export const getFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const facility = await facilityService.get(String(req.params.id));
    res.status(200).json({ success: true, data: facility });
  },
);

export const createFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const facility = await facilityService.create(req.body);
    res.status(201).json({ success: true, data: facility });
  },
);

export const updateFacility = asyncHandler(
  async (req: Request, res: Response) => {
    const facility = await facilityService.update(String(req.params.id), req.body);
    res.status(200).json({ success: true, data: facility });
  },
);

export const deleteFacility = asyncHandler(
  async (req: Request, res: Response) => {
    await facilityService.remove(String(req.params.id));
    res.status(200).json({ success: true, message: "Facility deleted" });
  },
);
