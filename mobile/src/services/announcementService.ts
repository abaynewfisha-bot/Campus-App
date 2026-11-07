import {
  Announcement,
  CreateAnnouncementInput,
  ListParams,
  Paginated,
} from "../types";
import { apiClient } from "./apiClient";

export const announcementService = {
  async list(params: ListParams = {}): Promise<Paginated<Announcement>> {
    const response = await apiClient.get("/announcements", { params });
    return {
      data: response.data.data as Announcement[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<Announcement> {
    const response = await apiClient.get(`/announcements/${id}`);
    return response.data.data as Announcement;
  },

  async create(input: CreateAnnouncementInput): Promise<Announcement> {
    const response = await apiClient.post("/announcements", input);
    return response.data.data as Announcement;
  },

  async update(
    id: string,
    input: Partial<CreateAnnouncementInput>,
  ): Promise<Announcement> {
    const response = await apiClient.put(`/announcements/${id}`, input);
    return response.data.data as Announcement;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/announcements/${id}`);
  },
};
