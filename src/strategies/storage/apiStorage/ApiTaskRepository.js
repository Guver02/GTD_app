import { TaskApiFormatter } from "../../../formatters/TaskApiFormatter";
import { apiService } from "../../../controllers/apiService"
import { RepositoryInterface } from "./../interfaces/RepositoryInterface";

class ApiTaskRepository extends RepositoryInterface {
async create(task) {
    const taskData = TaskApiFormatter.toApiFormat(task)
    return await apiService.post(
      `/api/v1/items/create-todo`,
      taskData
    );
  }

  async update(task) {
    const taskData = TaskApiFormatter.toApiUpdateFormat(task)
    return await apiService.put(
      `/api/v1/items/update-content/${task.id}`,
      taskData
    );
  }

  async delete(id) {
    return await apiService.delete(`/api/v1/items/delete/${id}`);
  }

  async changeSectionToLast(id, data) {
    return await apiService.put(`/api/v1/items/change-section-to-last/${id}`, data);
  }

  async changeOrderSameGroup(data) {
    return await apiService.put(`/api/v1/items/change-order-same-group`, data);
  }

  async changeSection(id, data) {
    return await apiService.put(`/api/v1/items/change-section/${id}`, data);
  }

  async updateStatus(id, data) {
    return await apiService.put(`/api/v1/items/update-status-todo/${id}`, data);
  }
}

export { ApiTaskRepository };
