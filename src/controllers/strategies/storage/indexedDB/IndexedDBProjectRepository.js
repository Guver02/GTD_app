import { jwtDecode } from "jwt-decode";
import { ItemsIndexedDBService } from "../../../../indexedDBServices/ItemsIndexedDBServices";
import { AppConfigManager } from "../../../manager/AppConfigManager";
import { IndexedDBManager } from "../../../manager/IndexedDBManager";
import { RepositoryInterface } from "../interfaces/RepositoryInterface";
import { ProjectApiFormatter } from "../../../../formatters/ProjectApiFormatter";


class IndexedDBProjectRepository extends RepositoryInterface {
  constructor() {
    super();
    const token = AppConfigManager.getToken()
    const decoded = token ? jwtDecode(token) : null

    const indexedDB = IndexedDBManager.getInstance()

    this.decoded = decoded
    this.itemsService = new ItemsIndexedDBService(indexedDB);
  }

  async create(project, unsectionId) {
    const payload = ProjectApiFormatter.toApiFormat(project);
    const newFolder = await this.itemsService.createFolder(payload ,this.decoded.userId, unsectionId);

    return newFolder;
  }

  async update(project) {
    const payload = ProjectApiFormatter.toApiUpdateContentFormat(project);
    const updatedItem = await this.itemsService.updateItem(project.id, payload, this.decoded.userId);
    return updatedItem;
  }

  async delete(id) {
    const deletedProject = await this.itemsService.deleteProject(id, this.decoded.userId);
    return deletedProject;
  }
}

export { IndexedDBProjectRepository };
