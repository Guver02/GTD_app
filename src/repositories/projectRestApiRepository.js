import { apiService } from "../services/apiService";

const projectRestApiRepository = {
  create: async (project, unsectionId) => {
    return await apiService.post(
      `/api/v1/items/create-folder/${unsectionId}`,
      project.getProjectFormatAPI()
    );
  },

  update: async (project) => {
    return await apiService.put(
      `/api/v1/items/update-content/${project.id}`,
      project.getUpdateContentFormatAPI()
    );
  },

  delete: async (id) => {
    return await apiService.delete(`/api/v1/items/delete-project/${id}`);
  }
};

export {projectRestApiRepository}
