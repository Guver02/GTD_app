
import { jwtDecode } from "jwt-decode";
import { ItemsIndexedDBService } from "../../../indexedDB/ItemsIndexedDBServices";
import { AppConfigManager } from "../../../manager/AppConfigManager";
import { RepositoryInterface } from "../interfaces/RepositoryInterface";
import { IndexedDBManager } from "../../../manager/IndexedDBManager";
import {SectionApiFormatter} from "../../../formatters/SectionApiFormatter"

class IndexedDBSectionRepository extends RepositoryInterface {
  constructor() {
    super();

    const token = AppConfigManager.getToken()
    const decoded = token ? jwtDecode(token) : null

    const indexedDB = IndexedDBManager.getInstance()

    this.decoded = decoded

    this.itemsService = new ItemsIndexedDBService(indexedDB);
  }

  async create(section) {
    const payload = SectionApiFormatter.toApiFormat(section);
    console.log('seccion saliendo del mapper', payload)
    // Creamos la sección usando el servicio local
    const newSection = await this.itemsService.createSection(payload, this.decoded.userId);

    return newSection;
  }

  async update(section) {
    const payload = SectionApiFormatter.toApiUpdateFormat(section);
    const updatedItem = await this.itemsService.updateItem(section.id, payload, this.decoded.userId);
    return updatedItem;
  }

  async delete(id, userId) {
    const deletedSection = await this.itemsService.deleteSection(id, this.decoded.userId);
    return deletedSection;
  }
}

export { IndexedDBSectionRepository };
