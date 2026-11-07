import { clubModel } from "../models/club.model";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { stringParam } from "../utils/query";
import { CreateClubInput, UpdateClubInput } from "../validators/club.validator";

export const clubService = {
  async list(query: Record<string, unknown>) {
    const pagination = getPagination(query);
    const { rows, total } = await clubModel.findAll({
      ...pagination,
      search: stringParam(query.search),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string) {
    const club = await clubModel.findById(id);

    if (!club) {
      throw ApiError.notFound("Club not found");
    }

    return club;
  },

  async create(input: CreateClubInput) {
    return clubModel.create(input);
  },

  async update(id: string, input: UpdateClubInput) {
    const updated = await clubModel.update(id, input);

    if (!updated) {
      throw ApiError.notFound("Club not found");
    }

    return updated;
  },

  async remove(id: string) {
    const removed = await clubModel.remove(id);

    if (!removed) {
      throw ApiError.notFound("Club not found");
    }
  },
};
