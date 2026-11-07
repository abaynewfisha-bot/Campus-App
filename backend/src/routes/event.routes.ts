import { Router } from "express";
import * as eventController from "../controllers/event.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator";

const router = Router();

router.get("/", eventController.listEvents);
router.get("/:id", eventController.getEvent);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createEventSchema),
  eventController.createEvent,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateEventSchema),
  eventController.updateEvent,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  eventController.deleteEvent,
);

export default router;
