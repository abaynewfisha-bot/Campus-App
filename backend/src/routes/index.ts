import { Router } from "express";
import announcementRoutes from "./announcement.routes";
import authRoutes from "./auth.routes";
import clubRoutes from "./club.routes";
import emergencyContactRoutes from "./emergencyContact.routes";
import eventRoutes from "./event.routes";
import facilityRoutes from "./facility.routes";
import feedbackRoutes from "./feedback.routes";
import notificationRoutes from "./notification.routes";
import requestRoutes from "./request.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/announcements", announcementRoutes);
router.use("/events", eventRoutes);
router.use("/clubs", clubRoutes);
router.use("/facilities", facilityRoutes);
router.use("/requests", requestRoutes);
router.use("/feedback", feedbackRoutes);
router.use("/emergency-contacts", emergencyContactRoutes);
router.use("/notifications", notificationRoutes);

export default router;
