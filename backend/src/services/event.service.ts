import { eventModel } from "../models/event.model";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { booleanParam, stringParam } from "../utils/query";
import {
  CreateEventInput,
  UpdateEventInput,
} from "../validators/event.validator";

export const eventService = {
  async list(query: Record<string, unknown>) {
    const pagination = getPagination(query);
    const { rows, total } = await eventModel.findAll({
      ...pagination,
      search: stringParam(query.search),
      category: stringParam(query.category),
      upcoming: booleanParam(query.upcoming),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string) {
    const event = await eventModel.findById(id);

    if (!event) {
      throw ApiError.notFound("Event not found");
    }

    return event;
  },

  async create(input: CreateEventInput, organizerId: string) {
    return eventModel.create({ ...input, organizerId });
  },

  async update(id: string, input: UpdateEventInput) {
    const updated = await eventModel.update(id, input);

    if (!updated) {
      throw ApiError.notFound("Event not found");
    }

    return updated;
  },

  async remove(id: string) {
    const removed = await eventModel.remove(id);

    if (!removed) {
      throw ApiError.notFound("Event not found");
    }
  },
};
