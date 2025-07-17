import { useDataStore } from "../store/data_store";

const taskZustandRepository = {
    create: (task) => {
        const store = useDataStore.getState();
        store.createTask(task);
    },

    update: (taskData) => {
        const store = useDataStore.getState();
        store.updateTask(taskData);
    },

    delete: (id) => {
        const store = useDataStore.getState();
        store.deleteTask(id);
    },

    swapOrder: (id1, id2, parentId) => {
        const store = useDataStore.getState();
        store.swapTaskOrder(id1, id2, parentId);
    },

    changeSection: (id, newParentId, prevParentId) => {
        const store = useDataStore.getState();
        store.changeSection(id, newParentId, prevParentId);
    },

    updateStatus: (id, data) => {
        const store = useDataStore.getState();
        store.changeStatus(id, data);
    },

    setNextAction: (id, data) => {
        const store = useDataStore.getState();
        store.changeNextAction(id, data);
    },

    setNextActionState: (id, data) => {
        console.log('AQQQQQQUI')
        const store = useDataStore.getState();
        store.setNextActionState(id, data)
    }
};

export { taskZustandRepository };
