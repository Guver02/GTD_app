
import { SectionApiMapper } from "../../../mappers/SectionApiMapper";
import { apiService } from "../../apiService";
import { RepositoryInterface } from "./interfaces/RepositoryInterface";

class ApiSectionRepository extends RepositoryInterface{
  async create(section) {
    const payload = SectionApiMapper.toApiFormat(section);
    return await apiService.post(`/api/v1/items/create-section`, payload);
  }

  async update(section) {
    const payload = SectionApiMapper.toApiUpdateFormat(section);
    return await apiService.put(`/api/v1/items/update-content/${section.id}`, payload);
  }

  async delete(id) {
    return await apiService.delete(`/api/v1/items/delete/${id}`);
  }
}

export { ApiSectionRepository };
