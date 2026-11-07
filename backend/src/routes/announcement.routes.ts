import { Router } from "express";
import * as announcementController from "../controllers/announcement.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createAnnouncementSchema,
  updateAnnouncementSchema,
} from "../validators/announcement.validator";

const router = Router();

router.get("/", announcementController.listAnnouncements);
router.get("/:id", announcementController.getAnnouncement);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createAnnouncementSchema),
  announcementController.createAnnouncement,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateAnnouncementSchema),
  announcementController.updateAnnouncement,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  announcementController.deleteAnnouncement,
);

export default router;
