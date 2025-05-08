
import { apiService } from "../services/apiService";

export const taskRestApiRepository = {
  create: (task) => apiService.post(`/api/v1/items/create-todo`, task.getTaskFormatAPI()),
  update: (task) => apiService.put(`/api/v1/items/update-content/${task.id}`, task.getUpdateTaskFormatAPI()),
  delete: (id) => apiService.delete(`/api/v1/items/delete/${id}`),
  changeSectionToLast: (id, data) => apiService.put(`/api/v1/items/change-section-to-last/${id}`, data),
  changeOrderSameGroup: (data) => apiService.put(`/api/v1/items/change-order-same-group`, data),
  changeSection: (id, data) => apiService.put(`/api/v1/items/change-section/${id}`, data),
  updateStatus: (id, data) => apiService.put(`/api/v1/items/update-status-todo/${id}`, data),
};
