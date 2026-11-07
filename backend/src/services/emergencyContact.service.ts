import { emergencyContactModel } from "../models/emergencyContact.model";
import { ApiError } from "../utils/ApiError";
import {
  CreateEmergencyContactInput,
  UpdateEmergencyContactInput,
} from "../validators/emergencyContact.validator";

export const emergencyContactService = {
  async list() {
    return emergencyContactModel.findAll();
  },

  async get(id: string) {
    const contact = await emergencyContactModel.findById(id);

    if (!contact) {
      throw ApiError.notFound("Emergency contact not found");
    }

    return contact;
  },

  async create(input: CreateEmergencyContactInput) {
    return emergencyContactModel.create(input);
  },

  async update(id: string, input: UpdateEmergencyContactInput) {
    const updated = await emergencyContactModel.update(id, input);

    if (!updated) {
      throw ApiError.notFound("Emergency contact not found");
    }

    return updated;
  },

  async remove(id: string) {
    const removed = await emergencyContactModel.remove(id);

    if (!removed) {
      throw ApiError.notFound("Emergency contact not found");
    }
  },
};
