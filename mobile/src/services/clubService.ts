import { Club, ListParams, Paginated } from "../types";
import { apiClient } from "./apiClient";

export const clubService = {
  async list(params: ListParams = {}): Promise<Paginated<Club>> {
    const response = await apiClient.get("/clubs", { params });
    return {
      data: response.data.data as Club[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<Club> {
    const response = await apiClient.get(`/clubs/${id}`);
    return response.data.data as Club;
  },

  async create(
    input: Omit<Club, "id" | "createdAt">,
  ): Promise<Club> {
    const response = await apiClient.post("/clubs", input);
    return response.data.data as Club;
  },

  async update(
    id: string,
    input: Partial<Omit<Club, "id" | "createdAt">>,
  ): Promise<Club> {
    const response = await apiClient.put(`/clubs/${id}`, input);
    return response.data.data as Club;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/clubs/${id}`);
  },
};
