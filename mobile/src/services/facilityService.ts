import { Facility, ListParams, Paginated } from "../types";
import { apiClient } from "./apiClient";

export const facilityService = {
  async list(params: ListParams = {}): Promise<Paginated<Facility>> {
    const response = await apiClient.get("/facilities", { params });
    return {
      data: response.data.data as Facility[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<Facility> {
    const response = await apiClient.get(`/facilities/${id}`);
    return response.data.data as Facility;
  },

  async create(
    input: Omit<Facility, "id" | "createdAt">,
  ): Promise<Facility> {
    const response = await apiClient.post("/facilities", input);
    return response.data.data as Facility;
  },

  async update(
    id: string,
    input: Partial<Omit<Facility, "id" | "createdAt">>,
  ): Promise<Facility> {
    const response = await apiClient.put(`/facilities/${id}`, input);
    return response.data.data as Facility;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/facilities/${id}`);
  },
};
