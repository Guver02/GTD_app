import { Task } from "../constructors/Items/Tasks";
import { useDataStore } from "../store/data_store";
import { getStatus } from "../utils/stateUtils";
import { useCallback } from 'react';
import { taskRestApiRepository } from '../repositories/taskRestApiRepository';

const taskRepo = taskRestApiRepository;

const useTaskService = () => {
  const createTask = useDataStore(state => state.createTask);
  const updateTask = useDataStore(state => state.updateTask);
  const deleteTask = useDataStore(state => state.deleteTask);
  const swapTaskOrder = useDataStore(state => state.swapTaskOrder);
  const changeSection = useDataStore(state => state.changeSection);
  const changeNextAction = useDataStore(state => state.changeNextAction);
  const changeStatus = useDataStore(state => state.changeStatus);
  const tasks = useDataStore(state => state.tasks);

  const createTaskStateAndApi = useCallback(async (data) => {
    const taskData = Task.getTask(data);
    console.log(taskData)
    createTask(taskData);
    await taskRepo.create(taskData);
  }, [createTask]);

  const updateTaskStateAndApi = useCallback(async (data, prevState) => {
    const taskData = Task.getTask(data);

    if (prevState.sectionId !== taskData.parent_id) {
      changeSection(taskData.id, taskData.parent_id, prevState.sectionId);
      delete taskData.order;
    }
    updateTask(taskData);

    if (prevState.sectionId !== taskData.parent_id) {
      await taskRepo.changeSectionToLast(taskData.id, { parent_id: taskData.parent_id });
    }
    await taskRepo.update(taskData);
  }, [updateTask, changeSection]);

  const deleteTaskAndApi = useCallback(async (id) => {
    deleteTask(id);
    await taskRepo.delete(id);
  }, [deleteTask]);

  const swapParentAndOrderStateAndApi = async (id1, id2, parentId) => {
    const { order: order1 } = tasks[id1];
    const { order: order2 } = tasks[id2];
    swapTaskOrder(id1, id2, parentId);

    await taskRepo.changeSection(id1, {
      sourceOrder: order1,
      targetOrder: order2,
      parent_id: parentId
    });
  };

  const swapTaskOrderStateAndApi = async (id1, id2, parentId) => {
    const { order: order1 } = tasks[id1];
    const { order: order2 } = tasks[id2];

    if (order1 !== order2) {
      swapTaskOrder(id1, id2, parentId);

      await taskRepo.changeOrderSameGroup({
        sourceOrder: order1,
        targetOrder: order2,
        parent_id: parentId
      });
    }
  };

  const changeStatusStateAndApi = async (id, newStatus) => {
    const data = { status: getStatus(newStatus) };
    changeStatus(id, data);
    await taskRepo.updateStatus(id, data);
  };


  const setNextActionStateAndApi = async (id) => {
    const data = { status: 'in_progress' };
    changeNextAction(id, data);
    await taskRepo.updateStatus(id, data);
  };

  return {
    updateTask: updateTaskStateAndApi,
    deleteTask: deleteTaskAndApi,
    swapTaskOrder: swapTaskOrderStateAndApi,
    swapParentAndOrder: swapParentAndOrderStateAndApi,
    createTask: createTaskStateAndApi,
    changeStatus: changeStatusStateAndApi,
    setNextAction: setNextActionStateAndApi,
  };
};

export { useTaskService };
