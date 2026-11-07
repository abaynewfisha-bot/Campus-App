import { facilityModel } from "../models/facility.model";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { stringParam } from "../utils/query";
import {
  CreateFacilityInput,
  UpdateFacilityInput,
} from "../validators/facility.validator";

export const facilityService = {
  async list(query: Record<string, unknown>) {
    const pagination = getPagination(query);
    const { rows, total } = await facilityModel.findAll({
      ...pagination,
      search: stringParam(query.search),
      category: stringParam(query.category),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string) {
    const facility = await facilityModel.findById(id);

    if (!facility) {
      throw ApiError.notFound("Facility not found");
    }

    return facility;
  },

  async create(input: CreateFacilityInput) {
    return facilityModel.create(input);
  },

  async update(id: string, input: UpdateFacilityInput) {
    const updated = await facilityModel.update(id, input);

    if (!updated) {
      throw ApiError.notFound("Facility not found");
    }

    return updated;
  },

  async remove(id: string) {
    const removed = await facilityModel.remove(id);

    if (!removed) {
      throw ApiError.notFound("Facility not found");
    }
  },
};
