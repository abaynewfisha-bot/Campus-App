import { notificationModel } from "../models/notification.model";
import { userModel } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { booleanParam } from "../utils/query";
import { CreateNotificationInput } from "../validators/notification.validator";

export const notificationService = {
  async list(query: Record<string, unknown>, userId: string) {
    const pagination = getPagination(query);
    const { rows, total, unread } = await notificationModel.findAll({
      ...pagination,
      userId,
      unreadOnly: booleanParam(query.unreadOnly),
    });

    return { ...paginate(rows, total, pagination), unread };
  },

  async create(input: CreateNotificationInput) {
    if (input.broadcast) {
      const count = await notificationModel.createForStudentsAndStaff({
        title: input.title,
        message: input.message,
      });
      return { broadcast: true, count };
    }

    if (input.broadcastRole) {
      const count = await notificationModel.createForRole({
        title: input.title,
        message: input.message,
        role: input.broadcastRole,
      });
      return { broadcastRole: input.broadcastRole, count };
    }

    if (!input.userId) {
      throw ApiError.badRequest(
        "Choose a user, a student/staff role, or all students and staff",
      );
    }

    const recipient = await userModel.findById(input.userId);

    if (!recipient || !["student", "staff"].includes(recipient.role)) {
      throw ApiError.notFound("Student or staff recipient not found");
    }

    const notification = await notificationModel.create({
      userId: input.userId,
      title: input.title,
      message: input.message,
    });

    if (!notification) {
      throw ApiError.notFound("Student or staff recipient not found");
    }

    return notification;
  },

  async markAsRead(id: string, userId: string) {
    const updated = await notificationModel.markAsRead(id, userId);

    if (!updated) {
      throw ApiError.notFound("Notification not found");
    }

    return updated;
  },

  async markAllAsRead(userId: string) {
    const count = await notificationModel.markAllAsRead(userId);
    return { updated: count };
  },

  async remove(id: string, userId: string) {
    const removed = await notificationModel.remove(id, userId);

    if (!removed) {
      throw ApiError.notFound("Notification not found");
    }
  },
};
