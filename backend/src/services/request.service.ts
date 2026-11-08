import { serviceRequestModel } from "../models/serviceRequest.model";
import { AuthUser, RequestStatus } from "../types";
import { ApiError } from "../utils/ApiError";
import { getPagination, paginate } from "../utils/pagination";
import { stringParam } from "../utils/query";
import { CreateRequestInput } from "../validators/request.validator";

export const requestService = {
  async list(query: Record<string, unknown>, user: AuthUser) {
    const pagination = getPagination(query);
    const canViewAll = user.role === "staff" || user.role === "admin";

    const { rows, total } = await serviceRequestModel.findAll({
      ...pagination,
      userId: canViewAll ? stringParam(query.userId) : user.id,
      status: stringParam(query.status),
      search: stringParam(query.search),
    });

    return paginate(rows, total, pagination);
  },

  async get(id: string, user: AuthUser) {
    const request = await serviceRequestModel.findById(id);

    if (!request) {
      throw ApiError.notFound("Service request not found");
    }

    if (user.role === "student" && request.userId !== user.id) {
      throw ApiError.forbidden("You can only view your own requests");
    }

    return request;
  },

  async create(input: CreateRequestInput, user: AuthUser) {
    return serviceRequestModel.create({
      ...input,
      userId: user.id,
      userName: user.fullName,
      userRole: user.role,
    });
  },

  async updateStatus(id: string, status: RequestStatus) {
    const updated = await serviceRequestModel.updateStatus(id, status);

    if (!updated) {
      throw ApiError.notFound("Service request not found");
    }

    return updated;
  },

  async remove(id: string, user: AuthUser) {
    const request = await serviceRequestModel.findById(id);

    if (!request) {
      throw ApiError.notFound("Service request not found");
    }

    if (user.role !== "admin" && request.userId !== user.id) {
      throw ApiError.forbidden("You can only delete your own requests");
    }

    await serviceRequestModel.remove(id);
  },
};
