import { ProjectApiFormatter } from "../../../formatters/ProjectApiFormatter";
import { ProjectApiMapper } from "../../../mappers/ProjectApiMapper";
import { apiService } from "../../apiService";
import { RepositoryInterface } from "./interfaces/RepositoryInterface";


class ApiProjectRepository extends RepositoryInterface {
    async create(project, unsectionId) {
        const payload = ProjectApiFormatter.toApiFormat(project);
        return await apiService.post(`/api/v1/items/create-folder/${unsectionId}`, payload);
    }

    async update(project) {
        const payload = ProjectApiFormatter.toApiUpdateContentFormat(project);
        return await apiService.put(`/api/v1/items/update-content/${project.id}`, payload);
    }

    async delete(id) {
        return await apiService.delete(`/api/v1/items/delete-project/${id}`);
    }
}

export { ApiProjectRepository };
