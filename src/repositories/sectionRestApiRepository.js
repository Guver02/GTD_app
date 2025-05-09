import { apiService } from "../services/apiService";

const sectionRestApiRepository = {
  create: async (section) => {
    return await apiService.post(
      `/api/v1/items/create-section`,
      section.getSectionFormatAPI()
    );
  },

  update: async (section) => {
    return await apiService.put(
      `/api/v1/items/update-content/${section.id}`,
      section.getUpdateContentFormatAPI()
    );
  },

  delete: async (id) => {
    return await apiService.delete(`/api/v1/items/delete/${id}`);
  }
};

export {sectionRestApiRepository}
