import {
  CreateEventInput,
  EventItem,
  ListParams,
  Paginated,
} from "../types";
import { apiClient } from "./apiClient";

export const eventService = {
  async list(params: ListParams = {}): Promise<Paginated<EventItem>> {
    const response = await apiClient.get("/events", { params });
    return {
      data: response.data.data as EventItem[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<EventItem> {
    const response = await apiClient.get(`/events/${id}`);
    return response.data.data as EventItem;
  },

  async create(input: CreateEventInput): Promise<EventItem> {
    const response = await apiClient.post("/events", input);
    return response.data.data as EventItem;
  },

  async update(
    id: string,
    input: Partial<CreateEventInput>,
  ): Promise<EventItem> {
    const response = await apiClient.put(`/events/${id}`, input);
    return response.data.data as EventItem;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};
