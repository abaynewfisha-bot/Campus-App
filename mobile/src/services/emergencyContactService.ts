import { EmergencyContact } from "../types";
import { apiClient } from "./apiClient";

export const emergencyContactService = {
  async list(): Promise<EmergencyContact[]> {
    const response = await apiClient.get("/emergency-contacts");
    return response.data.data as EmergencyContact[];
  },

  async create(
    input: Omit<EmergencyContact, "id" | "createdAt">,
  ): Promise<EmergencyContact> {
    const response = await apiClient.post("/emergency-contacts", input);
    return response.data.data as EmergencyContact;
  },

  async update(
    id: string,
    input: Partial<Omit<EmergencyContact, "id" | "createdAt">>,
  ): Promise<EmergencyContact> {
    const response = await apiClient.put(`/emergency-contacts/${id}`, input);
    return response.data.data as EmergencyContact;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/emergency-contacts/${id}`);
  },
};
