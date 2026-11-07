import { Router } from "express";
import * as feedbackController from "../controllers/feedback.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createFeedbackSchema,
  updateFeedbackStatusSchema,
} from "../validators/feedback.validator";

const router = Router();

router.use(authenticate);

router.get("/", feedbackController.listFeedback);
router.get("/:id", feedbackController.getFeedback);
router.post(
  "/",
  validate(createFeedbackSchema),
  feedbackController.createFeedback,
);
router.patch(
  "/:id/status",
  authorize("admin"),
  validate(updateFeedbackStatusSchema),
  feedbackController.updateFeedbackStatus,
);
router.delete("/:id", feedbackController.deleteFeedback);

export default router;
