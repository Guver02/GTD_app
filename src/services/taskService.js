import { Task } from "../constructors/Items/Tasks";
import { useDataStore } from "../store/data_store";
import { getStatus } from "../utils/stateUtils";
import { apiService } from "./apiService";
import { useCallback } from 'react'; // Importa useCallback para optimizar

const useTaskService = () => {
    const createTask = useDataStore((state) => state.createTask);
    const updateTask = useDataStore((state) => state.updateTask);
    const deleteTask = useDataStore((state) => state.deleteTask);
    const swapTaskOrder = useDataStore((state) => state.swapTaskOrder);
    const changeSection = useDataStore((state) => state.changeSection);
    const changeStatus = useDataStore((state) => state.changeStatus);

    const tasks = useDataStore((state) => state.tasks);

    const createTaskStateAndApi = useCallback(async (data) => {

        const taskData = Task.getTask(data)
        createTask(Task.getTask(data))

        await apiService.post(`/api/v1/items/create-todo`, taskData.getTaskFormatAPI());
    }, [createTask]);

    const updateTaskStateAndApi = useCallback(async (data, prevState) => {

        const taskData = Task.getTask(data);

        const dataReorder = {
            parent_id: taskData.parent_id
        }

        if(prevState.sectionId != taskData.parent_id){
            changeSection(taskData.id, taskData.parent_id ,prevState.sectionId)
            delete taskData.order;
        }
        updateTask(taskData)

        if(prevState.sectionId != taskData.parent_id){
            await apiService.put(`/api/v1/items/change-section-to-last/${taskData.id}`, dataReorder);
        }
        await apiService.put(`/api/v1/items/update-content/${taskData.id}`, taskData.getUpdateTaskFormatAPI());

    }, [updateTask]);


    const deleteTaskAndApi = useCallback(async (id) => {
        deleteTask(id)
        await apiService.delete(`/api/v1/items/delete/${id}`)
    }, [deleteTask])

    const swapParentAndOrderStateAndApi = async (id1, id2, parentId) => {
        const {order: order1} = tasks[id1]
        const {order: order2} = tasks[id2]
        swapTaskOrder(id1, id2, parentId)
        const data = {
            sourceOrder: order1,
            targetOrder: order2,
            parent_id: parentId
        }
        await apiService.put(`/api/v1/items/change-section/${id1}`, data);
    }

    const swapTaskOrderStateAndApi = async (id1, id2, parentId) => {
        const {order: order1} = tasks[id1]
        const {order: order2} = tasks[id2]

        const data = {
            sourceOrder: order1,
            targetOrder: order2,
            parent_id: parentId
        }
        if(!(order1 == order2)){
            swapTaskOrder(id1, id2, parentId)

            await apiService.put(`/api/v1/items/change-order-same-group`, data);
        }
    }

    const changeStatusStateAndApi = async(id, newStatus) => {
        const data = {
            status: getStatus(newStatus)
        }
        changeStatus(id, data)
        await apiService.put(`/api/v1/items/update-status-todo/${id}`, data)
    }

  return {
    updateTask: updateTaskStateAndApi,
    deleteTask: deleteTaskAndApi,
    swapTaskOrder: swapTaskOrderStateAndApi,
    swapParentAndOrder: swapParentAndOrderStateAndApi,
    createTask: createTaskStateAndApi,
    changeStatus: changeStatusStateAndApi
  };
};

export { useTaskService };
