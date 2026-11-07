import {
  CreateRequestInput,
  ListParams,
  Paginated,
  RequestStatus,
  ServiceRequest,
} from "../types";
import { apiClient } from "./apiClient";

export const requestService = {
  async list(params: ListParams = {}): Promise<Paginated<ServiceRequest>> {
    const response = await apiClient.get("/requests", { params });
    return {
      data: response.data.data as ServiceRequest[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<ServiceRequest> {
    const response = await apiClient.get(`/requests/${id}`);
    return response.data.data as ServiceRequest;
  },

  async create(input: CreateRequestInput): Promise<ServiceRequest> {
    const response = await apiClient.post("/requests", input);
    return response.data.data as ServiceRequest;
  },

  async updateStatus(
    id: string,
    status: RequestStatus,
  ): Promise<ServiceRequest> {
    const response = await apiClient.patch(`/requests/${id}/status`, { status });
    return response.data.data as ServiceRequest;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/requests/${id}`);
  },
};
