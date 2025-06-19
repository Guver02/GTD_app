import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from "../store/data_store";
import { createTaskStorage } from "./factories/createTaskStorage";
import { useGlobalTooltip } from "../app/providers/GlobalTooltip";
import { getStatus } from "../utils/stateUtils";
import {
    createTaskUseCase,
    updateTaskUseCase,
    deleteTaskUseCase,
    swapTaskOrderUseCase,
    swapParentAndOrderUseCase,
    changeTaskStatusUseCase,
    setNextActionUseCase,
} from "../services/taskServices";
import { taskZustandRepository } from "../repositories/taskZustandRepository";
import { storageError, unknownError } from "../utils/errorFunctions";

const useTaskService = () => {
    const { showTooltip } = useGlobalTooltip();
    const taskStorage = createTaskStorage();
    const tasks = useDataStore(state => state.tasks);

    const createTaskStateAndApi = useCallback(async (data) => {
        try {
            const task = createTaskUseCase(data, taskStorage, taskZustandRepository, storageError);

            showTooltip({
                tooltipText: `Tarea creada: ${task.item_name}`,
                duration: 3000,
            });

        } catch (error) {
            unknownError(error);
        }
    }, []);

    const updateTaskStateAndApi = useCallback(async (data, prevState) => {
        try {
            const task = updateTaskUseCase(data, prevState, taskStorage, taskZustandRepository, storageError);

            showTooltip({
                tooltipText: `Tarea actualizada: ${task.item_name}`,
                duration: 3000,
            });
        } catch (error) {
            unknownError(error);
        }
    }, []);

    const deleteTaskStateAndApi = useCallback(async (id) => {
        try {
            deleteTaskUseCase(id, taskStorage, taskZustandRepository, storageError);

            showTooltip({
                tooltipText: `Tarea eliminada correctamente`,
                duration: 3000,
            });
        } catch (error) {
            unknownError(error);
        }
    }, []);

    const swapTaskOrderStateAndApi = useCallback(async (id1, id2, parentId) => {
        try {
            swapTaskOrderUseCase(id1, id2, parentId, tasks, taskStorage, taskZustandRepository, storageError);
        } catch (error) {
            unknownError(error);
        }
    }, [tasks]);

    const swapParentAndOrderStateAndApi = useCallback(async (id1, id2, parentId) => {
        try {
            swapParentAndOrderUseCase(id1, id2, parentId, tasks, taskStorage, taskZustandRepository, storageError);
        } catch (error) {
            unknownError(error);
        }
    }, [tasks]);

    const changeStatusStateAndApi = useCallback(async (id, newStatus) => {
        try {
            changeTaskStatusUseCase(id, getStatus(newStatus), taskStorage, taskZustandRepository, storageError);
        } catch (error) {
            unknownError(error);
        }
    }, []);

    const setNextActionStateAndApi = useCallback(async (id) => {
        try {
            setNextActionUseCase(id, taskStorage, taskZustandRepository, storageError);
        } catch (error) {
            unknownError(error);
        }
    }, []);

    return {
        createTask: createTaskStateAndApi,
        updateTask: updateTaskStateAndApi,
        deleteTask: deleteTaskStateAndApi,
        swapTaskOrder: swapTaskOrderStateAndApi,
        swapParentAndOrder: swapParentAndOrderStateAndApi,
        changeStatus: changeStatusStateAndApi,
        setNextAction: setNextActionStateAndApi,
    };
};

export { useTaskService };
