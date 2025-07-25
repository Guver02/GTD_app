import { getUUID } from "../utils/generateUUID";

const itemTypesIDS = {
    todo: 1,
    section: 2,
    folder: 3
};
const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
};

class ItemsIndexedDBService {

    constructor(dbManager) {
        this.dbManager = dbManager;
    }

    async getItems(userId) {

        const [folders, sections, todos, subTodos, inbox, specialProjects, unsections, colors] = await Promise.all([
            this.getFolders(userId),
            this.getSections(userId),
            this.getTodos(userId),
            this.getSubTodos(userId),
            this.getInbox(userId),
            this.getSpecialProjects(userId),
            this.getUnsections(userId),
            this.getColors()
        ]);

        return {
            folders,
            sections,
            todos,
            subTodos,
            inbox,
            specialProjects,
            unsections,
            colors
        };
    }

    async getItemsByFilter(filterFn) {
        // Obtenemos la instancia de la base de datos esperando la promesa
        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readonly");
        const store = tx.objectStore("items");
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const result = request.result.filter(filterFn);
                resolve(result);
            };
            request.onerror = (event) => reject(event.target.error);
        });
    }

async getFolders(userId) {
    const db = await this.dbManager.db;
    const tx = db.transaction(["items", "colors"], "readonly");
    const itemsStore = tx.objectStore("items");
    const colorsStore = tx.objectStore("colors");

    const folders = [];

    await new Promise((resolve, reject) => {
        const request = itemsStore.openCursor();
        request.onsuccess = async (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const item = cursor.value;
                if (item.user_id === userId && item.type_id === itemTypesIDS.folder && item.parent_id === null) {
                    folders.push(item);
                }
                cursor.continue();
            } else {
                resolve();
            }
        };
        request.onerror = () => reject(request.error);
    });

    for (let folder of folders) {

        if (folder.color_id) {
            folder.myColor = await new Promise((resolve, reject) => {
                const colorRequest = colorsStore.get(folder.color_id);
                colorRequest.onsuccess = () => resolve(colorRequest.result);
                colorRequest.onerror = () => reject(colorRequest.error);
            });
        } else {
            folder.myColor = {
                color: '0,0,0',
                id: 0
            };
        }

        folder.subItems = await new Promise((resolve, reject) => {
            const subItems = [];
            const subRequest = itemsStore.openCursor();
            subRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const subItem = cursor.value;
                    if (subItem.parent_id === folder.id) {
                        subItems.push(subItem);
                    }
                    cursor.continue();
                } else {
                    resolve(subItems);
                }
            };
            subRequest.onerror = () => reject(subRequest.error);
        });

        folder.subItems.sort((a, b) => a.order - b.order);
    }

    folders.sort((a, b) => a.order - b.order);


    return folders;
}



    async getSections(userId) {
        return await this.getItemsByFilter(
            item => item.user_id === userId && item.type_id === itemTypesIDS.section
        );
    }

async getTodos(userId) {
  const todos = await this.getItemsByFilter(
    item => item.user_id === userId && item.type_id === itemTypesIDS.todo && item.special_type_id == null
  );

  const enrichedTodos = await Promise.all(todos.map(async (todo) => {
    let myColor = null;

    if (todo.color_id) {
      myColor = await this.getColorById(todo.color_id);
    }

    return {
      ...todo,
      myColor: myColor
    };
  }));

  return enrichedTodos;
}

async getColorById(colorId) {
    const db = await this.dbManager.db

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['colors'], 'readonly');
    const store = transaction.objectStore('colors');
    const request = store.get(colorId);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}


    async getSubTodos(userId) {
        return await this.getItemsByFilter(
            item => item.user_id === userId && item.type_id === itemTypesIDS.todo && item.special_type_id === specialTypesIDS.subTodo
        );
    }

    async getInbox(userId) {
        const items = await this.getItemsByFilter(
            item => item.user_id === userId && item.special_type_id === specialTypesIDS.inbox
        );

        return items[0] || null;
    }

    async getSpecialProjects(userId) {
        const specials = [
            specialTypesIDS.inbox,
            specialTypesIDS.referenceFile,
            specialTypesIDS.someday,
            specialTypesIDS.trackingFile,
            specialTypesIDS.waiting
        ];
        return await this.getItemsByFilter(
            item => item.user_id === userId && item.type_id === itemTypesIDS.folder && specials.includes(item.special_type_id)
        );
    }

    async getUnsections(userId) {
        return await this.getItemsByFilter(
            item => item.user_id === userId && item.special_type_id === specialTypesIDS.unsectioned
        );
    }

    async getColors() {
        const db = await this.dbManager.db;
        const tx = db.transaction("colors", "readonly");
        const store = tx.objectStore("colors");
        const request = store.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async createDefaultProjects(userId) {
        const defaultProjects = [
            {
                id: getUUID(),
                item_name: 'INBOX',
                user_id: userId,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 0,
                color_id: 0,
                special_type_id: specialTypesIDS.inbox,
                is_next: false
            },
            {
                id: getUUID(),
                item_name: 'SOMEDAY',
                user_id: userId,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 1,
                color_id: 0,
                special_type_id: specialTypesIDS.someday,
                is_next: false
            },
            {
                id: getUUID(),
                item_name: 'TRACKING FILE',
                user_id: userId,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 2,
                color_id: 0,
                special_type_id: specialTypesIDS.trackingFile,
                is_next: false
            },
            {
                id: getUUID(),
                item_name: 'WAITING',
                user_id: userId,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 3,
                color_id: 0,
                special_type_id: specialTypesIDS.waiting,
                is_next: false
            },
            {
                id: getUUID(),
                item_name: 'REFERENCE FILE',
                user_id: userId,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 4,
                color_id: 0,
                special_type_id: specialTypesIDS.referenceFile,
                is_next: false
            }
        ];

        for (let project of defaultProjects) {
            await this.createItem(project);

            await this.createUnsectioned(project, userId);
        }
    }

    async createUnsectioned(folderItem, userId, unsectionId) {
        const unsectioned = {
            id: unsectionId || getUUID(),
            item_name: 'UNSECTIONED',
            user_id: userId,
            type_id: itemTypesIDS.section,
            parent_id: folderItem.id,
            order: 0,
            special_type_id: specialTypesIDS.unsectioned
        };
        return await this.createItem(unsectioned);
    }

    async getById(id) {

        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readonly");
        const store = tx.objectStore("items");
        const request = store.get(id);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result ?? null);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    async updateItem(id, newData, userID) {
        const db = await this.dbManager.db;

        const item = await this.getById(id);
        if (!item) {
            throw new Error('Item Not Found');
        }
        Object.assign(item, newData);
        item.updated_at = new Date();

        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");
        store.put(item);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(item);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async createItem(item) {
        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");

        item.created_at = new Date();
        item.updated_at = new Date();

        store.add(item);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(item);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async deleteItem(id) {
        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");
        store.delete(id);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(true);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async reorderOnDeleteSection(section, userId) {
    const siblings = await this.getItemsByFilter(i =>
        i.user_id === userId &&
        i.type_id === itemTypesIDS.section &&
        i.parent_id === section.parent_id &&
        i.order > section.order
    );

    for (const sibling of siblings) {
        sibling.order -= 1;
        await this.updateItem(sibling.id, { order: sibling.order }, userId);
    }
}

async reorderOnDeleteTodo(todo, userId) {
    const siblings = await this.getItemsByFilter(i =>
        i.user_id === userId &&
        i.type_id === itemTypesIDS.todo &&
        i.parent_id === todo.parent_id &&
        i.order > todo.order
    );

    for (const sibling of siblings) {
        sibling.order -= 1;
        await this.updateItem(sibling.id, { order: sibling.order }, userId);
    }
}
async deleteSection(sectionId, userId) {
    const section = await this.getById(sectionId);
    if (!section || section.user_id !== userId || section.type_id !== itemTypesIDS.section) {
        throw new Error("Section not found or invalid");
    }

    await this.reorderOnDeleteSection(section, userId);

    const todos = await this.getItemsByFilter(item =>
        item.parent_id === sectionId &&
        item.type_id === itemTypesIDS.todo &&
        item.user_id === userId
    );

    for (const todo of todos) {
        await this.deleteItem(todo.id, userId);
    }

    await this.deleteItem(sectionId, userId);
}
async deleteTodo(todoId, userId) {
    const todo = await this.getById(todoId);
    if (!todo || todo.user_id !== userId || todo.type_id !== itemTypesIDS.todo) {
        throw new Error("Todo not found or invalid");
    }

    await this.reorderOnDeleteTodo(todo, userId);

    await this.deleteItem(todoId, userId);
}


    async deleteProject(projectId, userID) {
        const project = await this.getById(projectId);
        if (!project || project.user_id !== userID || project.type_id !== itemTypesIDS.folder) {
            throw new Error("Project not found or invalid");
        }

        await this.reorderOnDeleteProject(project, userID);

        const sections = await this.getItemsByFilter(item =>
            item.parent_id === projectId &&
            item.type_id === itemTypesIDS.section &&
            item.user_id === userID
        );

        for (const section of sections) {
            const todos = await this.getItemsByFilter(item =>
                item.parent_id === section.id &&
                item.type_id === itemTypesIDS.todo &&
                item.user_id === userID
            );

            for (const todo of todos) {
                await this.deleteItem(todo.id, userID);
            }

            await this.deleteItem(section.id, userID);
        }

        await this.deleteItem(projectId, userID);
    }

        async getActualLastOrder(typeId, userId, parentId = null) {
        const items = await this.getItemsByFilter(item =>
            item.user_id === userId &&
            item.type_id === typeId &&
            (parentId !== null ? item.parent_id === parentId : true)
        );

        if (items.length === 0) return 0;

        const maxOrder = Math.max(...items.map(i => i.order || 0));
        return maxOrder + 1;
    }

    async createTodo(body, userId) {
        const { parent_id } = body;

        const parent = await this.getById(parent_id);
        if (!parent || parent.user_id !== userId || ![itemTypesIDS.todo, itemTypesIDS.section].includes(parent.type_id)) {
            throw new Error("The defined item for this to-do does not exist");
        }

        const order = await this.getActualLastOrder(itemTypesIDS.todo, userId, parent_id);
        const newTodo = {
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.todo,
            parent_id,
            order
        };

        return await this.createItem(newTodo);
    }

    async createSection(body, userId) {
        const { parent_id } = body;

        const folder = await this.getById(parent_id);
        if (!folder || folder.user_id !== userId || folder.type_id !== itemTypesIDS.folder) {
            throw new Error("The defined folder for this section does not exist");
        }

        const order = await this.getActualLastOrder(itemTypesIDS.section, userId, parent_id);
        const newSection = {
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.section,
            parent_id,
            order
        };

        return await this.createItem(newSection);
    }

    async createFolder(body, userId, unsectionId) {
        const order = await this.getActualLastOrder(itemTypesIDS.folder, userId);
        const newFolder = {
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.folder,
            parent_id: null,
            order
        };

        const createdFolder = await this.createItem(newFolder);
        await this.createUnsectioned(createdFolder, userId, unsectionId);

        return createdFolder;
    }

     async getActualLastOrderForTodos(typeItemId, userId, parentId) {
        const items = await this.getItemsByFilter(item =>
            item.user_id === userId &&
            item.type_id === typeItemId &&
            item.parent_id === parentId
        );

        if (items.length === 0) return 0;

        const maxOrder = Math.max(...items.map(i => i.order || 0));
        return maxOrder + 1;
    }

      async reorderOnDelete(item, userId) {
        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.todo &&
            i.parent_id === item.parent_id &&
            i.order > item.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }
    }



    async reorderOnDeleteProject(project, userId) {
        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.folder &&
            i.order > project.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }
    }

      async moveTodoToSection(taskId, newSectionParentId, userId) {
        const editedItem = await this.getById(taskId);
        if (!editedItem || editedItem.user_id !== userId) {
            throw new Error("Item not found");
        }

        const lastOrderPreviousSection = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, editedItem.parent_id);
        const newOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, newSectionParentId);

        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.todo &&
            i.parent_id === editedItem.parent_id &&
            i.order > editedItem.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }

        editedItem.parent_id = newSectionParentId;
        editedItem.order = newOrder;
        await this.updateItem(editedItem.id, editedItem, userId);

        return editedItem;
    }
        async changeOrderSameGroup(sourceOrder, targetOrder, parentId, userId) {
        if (sourceOrder === targetOrder) {
            throw new Error('The order should not be equal');
        }

        if (sourceOrder < targetOrder) {
            return await this.upward(sourceOrder, targetOrder, parentId, userId);
        }
        if (sourceOrder > targetOrder) {
            return await this.downward(sourceOrder, targetOrder, parentId, userId);
        }
    }

    async upward(source, target, parentId, userId) {
        const items = await this.getItemsByFilter(i =>
            i.parent_id === parentId && i.user_id === userId &&
            i.order >= source && i.order <= target
        );

        for (const item of items) {
            if (item.order === source) {
                item.order = target;
            } else {
                item.order -= 1;
            }
            await this.updateItem(item.id, { order: item.order }, userId);
        }

        return true;
    }
    async changeTodoToFolder(todoId, userId) {
        const newFolder = await this.getById(todoId);
        if (!newFolder || newFolder.user_id !== userId || newFolder.type_id !== itemTypesIDS.todo) {
            throw new Error('This item is not a todo');
        }

        const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, newFolder.parent_id);

        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.todo &&
            i.parent_id === newFolder.parent_id &&
            i.order > newFolder.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }

        const newOrder = await this.getActualLastOrder(itemTypesIDS.folder, userId);
        newFolder.type_id = itemTypesIDS.folder;
        newFolder.order = newOrder;
        await this.updateItem(newFolder.id, newFolder, userId);

        const unsectioned = await this.createUnsectioned(newFolder.id, userId);

        const subtodos = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.parent_id === todoId
        );

        for (const sub of subtodos) {
            sub.type_id = itemTypesIDS.todo;
            sub.special_type_id = null;
            sub.parent_id = unsectioned.id;
            await this.updateItem(sub.id, sub, userId);
        }

        return newFolder;
    }

        async changeSectionToFolder(sectionID, userId) {
        const newFolder = await this.getById(sectionID);
        if (!newFolder || newFolder.user_id !== userId || newFolder.type_id !== itemTypesIDS.section) {
            throw new Error('This item is not a section');
        }

        const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.section, userId, newFolder.parent_id);

        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.section &&
            i.parent_id === newFolder.parent_id &&
            i.order > newFolder.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }

        const newOrder = await this.getActualLastOrder(itemTypesIDS.folder, userId);
        newFolder.type_id = itemTypesIDS.folder;
        newFolder.order = newOrder;
        await this.updateItem(newFolder.id, newFolder, userId);

        const unsectioned = await this.createUnsectioned(newFolder.id, userId);

        const subtodos = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.parent_id === sectionID
        );

        for (const sub of subtodos) {
            sub.parent_id = unsectioned.id;
            await this.updateItem(sub.id, sub, userId);
        }

        return newFolder;
    }


    async downward(source, target, parentId, userId) {
        const items = await this.getItemsByFilter(i =>
            i.parent_id === parentId && i.user_id === userId &&
            i.order >= target && i.order <= source
        );

        for (const item of items) {
            if (item.order === source) {
                item.order = target;
            } else {
                item.order += 1;
            }
            await this.updateItem(item.id, { order: item.order }, userId);
        }

        return true;
    }


    async updateStatusTodo(id, newData, userId) {
        const item = await this.getById(id);
        if (!item || item.user_id !== userId || item.type_id !== itemTypesIDS.todo) {
            throw new Error("The item does not exist or is not a todo");
        }

        Object.assign(item, newData);
        item.updated_at = new Date();
        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");
        store.put(item);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(item);
            tx.onerror = (event) => reject(event.target.error);
        });
    }

    async setNextActionState(id, newData, userId) {
        const item = await this.getById(id);
        if (!item || item.user_id !== userId || item.type_id !== itemTypesIDS.todo) {
            throw new Error("The item does not exist or is not a todo");
        }

        Object.assign(item, newData);
        item.updated_at = new Date();
        const db = await this.dbManager.db;
        const tx = db.transaction("items", "readwrite");
        const store = tx.objectStore("items");
        store.put(item);

        return new Promise((resolve, reject) => {
            tx.oncomplete = () => resolve(item);
            tx.onerror = (event) => reject(event.target.error);
        });
    }


    async moveTodoToSection(taskId, newSectionParentId, userId) {
        const editedItem = await this.getById(taskId);
        if (!editedItem || editedItem.user_id !== userId) {
            throw new Error("Item not found");
        }

        const newOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, newSectionParentId);

        const siblings = await this.getItemsByFilter(i =>
            i.user_id === userId &&
            i.type_id === itemTypesIDS.todo &&
            i.parent_id === editedItem.parent_id &&
            i.order > editedItem.order
        );

        for (const sibling of siblings) {
            sibling.order -= 1;
            await this.updateItem(sibling.id, { order: sibling.order }, userId);
        }


        editedItem.parent_id = newSectionParentId;
        editedItem.order = newOrder;
        await this.updateItem(editedItem.id, editedItem, userId);

        return editedItem;
    }

}

export { ItemsIndexedDBService, itemTypesIDS, specialTypesIDS };
