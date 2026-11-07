import { announcementModel } from "../models/announcement.model";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { stringParam } from "../utils/query";
import {
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from "../validators/announcement.validator";

export const announcementService = {
  async list(query: Record<string, unknown>) {
    const pagination = getPagination(query);
    const { rows, total } = await announcementModel.findAll({
      ...pagination,
      search: stringParam(query.search),
      category: stringParam(query.category),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string) {
    const announcement = await announcementModel.findById(id);

    if (!announcement) {
      throw ApiError.notFound("Announcement not found");
    }

    return announcement;
  },

  async create(input: CreateAnnouncementInput, authorId: string) {
    return announcementModel.create({ ...input, authorId });
  },

  async update(id: string, input: UpdateAnnouncementInput) {
    const updated = await announcementModel.update(id, input);

    if (!updated) {
      throw ApiError.notFound("Announcement not found");
    }

    return updated;
  },

  async remove(id: string) {
    const removed = await announcementModel.remove(id);

    if (!removed) {
      throw ApiError.notFound("Announcement not found");
    }
  },
};
