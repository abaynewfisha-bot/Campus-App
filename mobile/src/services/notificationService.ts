import {
  AppNotification,
  CreateNotificationInput,
  CreateNotificationResult,
  ListParams,
  NotificationList,
} from "../types";
import { apiClient } from "./apiClient";

export const notificationService = {
  async create(
    input: CreateNotificationInput,
  ): Promise<CreateNotificationResult> {
    const response = await apiClient.post("/notifications", input);
    return response.data.data as CreateNotificationResult;
  },

  async list(params: ListParams = {}): Promise<NotificationList> {
    const response = await apiClient.get("/notifications", { params });
    return {
      data: response.data.data as AppNotification[],
      meta: response.data.meta,
      unread: response.data.unread as number,
    };
  },

  async markRead(id: string): Promise<AppNotification> {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data.data as AppNotification;
  },

  async markAllRead(): Promise<{ updated: number }> {
    const response = await apiClient.patch("/notifications/read-all");
    return response.data.data as { updated: number };
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/notifications/${id}`);
  },
};
