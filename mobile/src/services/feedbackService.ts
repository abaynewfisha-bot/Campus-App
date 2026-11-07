import {
  CreateFeedbackInput,
  Feedback,
  FeedbackStatus,
  ListParams,
  Paginated,
} from "../types";
import { apiClient } from "./apiClient";

export const feedbackService = {
  async list(params: ListParams = {}): Promise<Paginated<Feedback>> {
    const response = await apiClient.get("/feedback", { params });
    return {
      data: response.data.data as Feedback[],
      meta: response.data.meta,
    };
  },

  async get(id: string): Promise<Feedback> {
    const response = await apiClient.get(`/feedback/${id}`);
    return response.data.data as Feedback;
  },

  async create(input: CreateFeedbackInput): Promise<Feedback> {
    const response = await apiClient.post("/feedback", input);
    return response.data.data as Feedback;
  },

  async updateStatus(id: string, status: FeedbackStatus): Promise<Feedback> {
    const response = await apiClient.patch(`/feedback/${id}/status`, { status });
    return response.data.data as Feedback;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/feedback/${id}`);
  },
};
