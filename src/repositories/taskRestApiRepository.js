import { apiService } from "../services/apiService";

const taskRestApiRepository = {
  create: async (task) => {
    return await apiService.post(
      `/api/v1/items/create-todo`,
      task.getTaskFormatAPI()
    );
  },

  update: async (task) => {
    return await apiService.put(
      `/api/v1/items/update-content/${task.id}`,
      task.getUpdateTaskFormatAPI()
    );
  },

  delete: async (id) => {
    return await apiService.delete(`/api/v1/items/delete/${id}`);
  },

  changeSectionToLast: async (id, data) => {
    return await apiService.put(`/api/v1/items/change-section-to-last/${id}`, data);
  },

  changeOrderSameGroup: async (data) => {
    return await apiService.put(`/api/v1/items/change-order-same-group`, data);
  },

  changeSection: async (id, data) => {
    return await apiService.put(`/api/v1/items/change-section/${id}`, data);
  },

  updateStatus: async (id, data) => {
    return await apiService.put(`/api/v1/items/update-status-todo/${id}`, data);
  }
};

export {taskRestApiRepository}
