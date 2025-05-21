import React from 'react';
import * as style from './TaskList.module.css'
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskPlaceholder } from './Task';

const {
    taskListContainer
} = style

function TaskList({ taskIds, TaskComponent, parentId, isMove = true}) {

  return (
        <div
        className={taskListContainer}>
            <SortableContext items={taskIds} strategy={verticalListSortingStrategy} id={parentId}>
            {taskIds.length > 0 ?
            taskIds.map((taskId) => (
                <TaskComponent key={taskId} taskId={taskId} isMove={isMove}/>
                ))
            :
                <TaskPlaceholder sectionId={parentId}/>
            }
            </SortableContext>
        </div>

  );
}

export {TaskList}
