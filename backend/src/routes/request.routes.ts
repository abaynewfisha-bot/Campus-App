import { Router } from "express";
import * as requestController from "../controllers/request.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createRequestSchema,
  updateRequestStatusSchema,
} from "../validators/request.validator";

const router = Router();

router.use(authenticate);

router.get("/", requestController.listRequests);
router.get("/:id", requestController.getRequest);
router.post(
  "/",
  validate(createRequestSchema),
  requestController.createRequest,
);
router.patch(
  "/:id/status",
  authorize("staff", "admin"),
  validate(updateRequestStatusSchema),
  requestController.updateRequestStatus,
);
router.delete("/:id", requestController.deleteRequest);

export default router;
