import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../validators/auth.validator";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);

router.get("/profile", authenticate, authController.getProfile);
router.put(
  "/profile",
  authenticate,
  validate(updateProfileSchema),
  authController.updateProfile,
);

router.get(
  "/users",
  authenticate,
  authorize("admin"),
  authController.listUsers,
);

export default router;
