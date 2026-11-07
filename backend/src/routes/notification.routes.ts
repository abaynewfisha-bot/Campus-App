import { Router } from "express";
import * as notificationController from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { createNotificationSchema } from "../validators/notification.validator";

const router = Router();

router.use(authenticate);

router.get("/", notificationController.listNotifications);
router.patch("/read-all", notificationController.markAllNotificationsRead);
router.patch("/:id/read", notificationController.markNotificationRead);
router.post(
  "/",
  authorize("admin"),
  validate(createNotificationSchema),
  notificationController.createNotification,
);
router.delete("/:id", notificationController.deleteNotification);

export default router;
