import { feedbackModel } from "../models/feedback.model";
import { AuthUser, FeedbackStatus } from "../types";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { stringParam } from "../utils/query";
import { CreateFeedbackInput } from "../validators/feedback.validator";

export const feedbackService = {
  async list(query: Record<string, unknown>, user: AuthUser) {
    const pagination = getPagination(query);
    const canViewAll = user.role === "admin";

    const { rows, total } = await feedbackModel.findAll({
      ...pagination,
      userId: canViewAll ? stringParam(query.userId) : user.id,
      status: stringParam(query.status),
      search: stringParam(query.search),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string, user: AuthUser) {
    const entry = await feedbackModel.findById(id);

    if (!entry) {
      throw ApiError.notFound("Feedback not found");
    }

    if (user.role !== "admin" && entry.userId !== user.id) {
      throw ApiError.forbidden("You can only view your own feedback");
    }

    return entry;
  },

  async create(input: CreateFeedbackInput, user: AuthUser) {
    return feedbackModel.create({
      ...input,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
    });
  },

  async updateStatus(id: string, status: FeedbackStatus) {
    const updated = await feedbackModel.updateStatus(id, status);

    if (!updated) {
      throw ApiError.notFound("Feedback not found");
    }

    return updated;
  },

  async remove(id: string, user: AuthUser) {
    const entry = await feedbackModel.findById(id);

    if (!entry) {
      throw ApiError.notFound("Feedback not found");
    }

    if (user.role !== "admin" && entry.userId !== user.id) {
      throw ApiError.forbidden("You can only delete your own feedback");
    }

    await feedbackModel.remove(id);
  },
};
