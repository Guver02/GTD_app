import { Task } from "../domain/Task";

const TaskApiFormatter = {

    toApiFormat(task) {
        if (!(task instanceof Task)) {
            throw new Error('El objeto proporcionado no es una instancia de Task');
        }

        return {
            id: task.id,
            item_name: task.item_name,
            description: task.description,
            parent_id: task.parent_id,
            type_id: task.type_id,
            is_favorite: task.is_favorite,
            status: task.status,
            color_id: task.color_id
        };
    },

    toApiUpdateFormat(task) {
        if (!(task instanceof Task)) {
            throw new Error('El objeto proporcionado no es una instancia de Task');
        }

        return {
            item_name: task.item_name,
            description: task.description,
            is_favorite: task.is_favorite,
            status: task.status,
            color_id: task.color_id
        };
    }
};

export { TaskApiFormatter };
