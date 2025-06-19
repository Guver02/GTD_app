import { Task } from "../domain/Task";

const createTaskUseCase = (taskData, taskStorage, taskState, onError) => {
  const task = Task.createTask(taskData);
  taskState.create(task);

  void taskStorage.create(task).catch(onError);

  return task;
};

const updateTaskUseCase = (taskData, prevState, taskStorage, taskState, onError) => {
  const updatedTask = Task.createTask(taskData);
  updatedTask.update(taskData);

  if (prevState.sectionId !== updatedTask.parent_id) {
    taskState.changeSection(updatedTask.id, updatedTask.parent_id, prevState.sectionId);
    delete updatedTask.order;
  }

  taskState.update(updatedTask);

  void taskStorage.update(updatedTask).catch(onError);

  if (prevState.sectionId !== updatedTask.parent_id) {
    void taskStorage.changeSectionToLast(updatedTask.id, { parent_id: updatedTask.parent_id }).catch(onError);
  }

  return updatedTask;
};

const deleteTaskUseCase = (id, taskStorage, taskState, onError) => {
  taskState.delete(id);

  void taskStorage.delete(id).catch(onError);
};

const swapTaskOrderUseCase = (id1, id2, parentId, tasks, taskStorage, taskState, onError) => {
  const order1 = tasks[id1].order;
  const order2 = tasks[id2].order;

  taskState.swapOrder(id1, id2, parentId);

  if (order1 !== order2) {
    void taskStorage.changeOrderSameGroup({ sourceOrder: order1, targetOrder: order2, parent_id: parentId })
      .catch(onError);
  }
};

const swapParentAndOrderUseCase = (id1, id2, parentId, tasks, taskStorage, taskState, onError) => {
  const order1 = tasks[id1].order;
  const order2 = tasks[id2].order;

  taskState.swapOrder(id1, id2, parentId);

  void taskStorage.changeSection(id1, {
    sourceOrder: order1,
    targetOrder: order2,
    parent_id: parentId,
  }).catch(onError);
};

const changeTaskStatusUseCase = (id, newStatus, taskStorage, taskState, onError) => {
  const data = { status: newStatus };
  taskState.updateStatus(id, data);
  void taskStorage.updateStatus(id, data).catch(onError);
};

const setNextActionUseCase = (id, taskStorage, taskState, onError) => {
  const data = { status: 'in_progress' };
  taskState.setNextAction(id, data);
  void taskStorage.updateStatus(id, data).catch(onError);
};

export {
  createTaskUseCase,
  updateTaskUseCase,
  deleteTaskUseCase,
  swapTaskOrderUseCase,
  swapParentAndOrderUseCase,
  changeTaskStatusUseCase,
  setNextActionUseCase,
};
