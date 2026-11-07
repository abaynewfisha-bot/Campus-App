import { Router } from "express";
import * as emergencyContactController from "../controllers/emergencyContact.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createEmergencyContactSchema,
  updateEmergencyContactSchema,
} from "../validators/emergencyContact.validator";

const router = Router();

router.get("/", emergencyContactController.listEmergencyContacts);
router.get("/:id", emergencyContactController.getEmergencyContact);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createEmergencyContactSchema),
  emergencyContactController.createEmergencyContact,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateEmergencyContactSchema),
  emergencyContactController.updateEmergencyContact,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  emergencyContactController.deleteEmergencyContact,
);

export default router;
