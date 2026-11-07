import { Router } from "express";
import * as facilityController from "../controllers/facility.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createFacilitySchema,
  updateFacilitySchema,
} from "../validators/facility.validator";

const router = Router();

router.get("/", facilityController.listFacilities);
router.get("/:id", facilityController.getFacility);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createFacilitySchema),
  facilityController.createFacility,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateFacilitySchema),
  facilityController.updateFacility,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  facilityController.deleteFacility,
);

export default router;
