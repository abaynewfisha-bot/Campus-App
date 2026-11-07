import { notificationModel } from "../models/notification.model";
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
      const count = await notificationModel.createForAllUsers({
        title: input.title,
        message: input.message,
      });
      return { broadcast: true, count };
    }

    if (!input.userId) {
      throw ApiError.badRequest("A userId or broadcast flag is required");
    }

    return notificationModel.create({
      userId: input.userId,
      title: input.title,
      message: input.message,
    });
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
