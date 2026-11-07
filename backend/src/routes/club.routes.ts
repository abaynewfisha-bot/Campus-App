import { Router } from "express";
import * as clubController from "../controllers/club.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  createClubSchema,
  updateClubSchema,
} from "../validators/club.validator";

const router = Router();

router.get("/", clubController.listClubs);
router.get("/:id", clubController.getClub);

router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createClubSchema),
  clubController.createClub,
);

router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateClubSchema),
  clubController.updateClub,
);

router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  clubController.deleteClub,
);

export default router;
