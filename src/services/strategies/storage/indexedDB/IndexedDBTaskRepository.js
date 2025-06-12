import { jwtDecode } from "jwt-decode";
import { ItemsIndexedDBService } from "../../../../indexedDBServices/ItemsIndexedDBServices";
import { TaskApiMapper } from "../../../../mappers/TaskApiMapper";
import { AppConfigManager } from "../../../manager/AppConfigManager";
import { RepositoryInterface } from "../interfaces/RepositoryInterface";
import { IndexedDBManager } from "../../../manager/IndexedDBManager";

class IndexedDBTaskRepository extends RepositoryInterface {
  constructor() {
    super();

    const token = AppConfigManager.getToken();
    const decoded = token ? jwtDecode(token) : null;
    const indexedDB = IndexedDBManager.getInstance();

    this.decoded = decoded;
    this.itemsService = new ItemsIndexedDBService(indexedDB);
  }

  async create(task) {
    const payload = TaskApiMapper.toApiFormat(task);
    const newTodo = await this.itemsService.createTodo(payload, this.decoded.userId);
    return newTodo;
  }

  async update(task) {
    const payload = TaskApiMapper.toApiUpdateFormat(task);
    const updatedTodo = await this.itemsService.updateItem(task.id, payload, this.decoded.userId);
    return updatedTodo;
  }

  async delete(id) {
    const deletedTodo = await this.itemsService.deleteTodo(id, this.decoded.userId)
    return deletedTodo;
  }

  async changeSectionToLast(id, data) {
    console.log('llevar un task a otro section u otro proyecto y reordenar el lugar de donde salio')
    const { parent_id } = data;
    const movedTodo = await this.itemsService.moveTodoToSection(id, parent_id, this.decoded.userId);
    return movedTodo;
  }

  async changeOrderSameGroup(data) {//esta fallando
        console.log('moviendo tarea dentro de una misma seccion reordenando')

    const { sourceOrder, targetOrder, parent_id } = data;
    const reordered = await this.itemsService.changeOrderSameGroup(sourceOrder, targetOrder, parent_id, this.decoded.userId);
    return reordered;
  }

  async changeSection(id, data) {
    console.log('moviendo tarea de una seccion a otra')
    const { sourceOrder, targetOrder, parent_id } = data;
    await this.itemsService.moveTodoToSection(id, parent_id, this.decoded.userId);
    if (sourceOrder !== targetOrder) {
      const reordered = await this.itemsService.changeOrderSameGroup(sourceOrder, targetOrder, parent_id, this.decoded.userId);
      return reordered;
    }
    return true;
  }

  async updateStatus(id, data) {
    const updatedStatus = await this.itemsService.updateStatusTodo(id, data, this.decoded.userId);
    return updatedStatus;
  }
}

export { IndexedDBTaskRepository };
