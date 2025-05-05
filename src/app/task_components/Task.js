import React, { useContext, useRef, useState } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './Task.module.css'
import { CheckCircle, Circle } from "react-feather";
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Move2 } from "../utils_component/Move2";
import { useTaskService } from "../../services/taskService";

const {
    taskContainer,
    taskContent,
    content,
    description,
    iconsContainer,
    container,
    moveIcon
} = style

const Task = React.memo(({ taskId, isMove = true }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging} = useSortable({id: taskId,});

    const {openModal} = useContext(ModalContext)
    const task = useDataStore((state) => state.tasks[taskId]);
    const {changeStatus} = useTaskService()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    console.log(task)

    const handleClick = () => {
        openModal(<ViewTask
            id = {taskId}
            itemName = {task.item_name}
            description = {task.description}
            parent_id={task.parent_id}
            order={task.order}
            />)
    };

    const handleCheckIsPending = () => {
        changeStatus(taskId ,false)
    }
    const handleCheckIsCompleted = () => {
        changeStatus(taskId, true)
    }

    if (!task) return null;
    return (
      <div
      ref={setNodeRef}
      {...attributes}
      className={container}
      style={style}
      >
        {isMove &&
            <div
            className={moveIcon}
            {...listeners}>
                <Move2/>
            </div>
        }

        <div className={taskContainer}>
            <div
            className={taskContent}
            onClick={handleClick}
            >
                <span className={content}>
                    {task.item_name}
                </span>
                <span className={description}>
                    {task.order}
                </span>
                <div className={iconsContainer}>

                </div>
            </div>

            {(task.status == 'completed') ?
            <CheckCircle onClick={handleCheckIsPending}/>
            :
            <Circle onClick={handleCheckIsCompleted}/>
            }
        </div>

      </div>
    );
})

/**<div
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            >
                {!isHover?
                <Circle/>
                :
                <CheckCircle/>
                }

            </div> */

function TaskPlaceholder({sectionId}){
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging} = useSortable({id: `placeholder-${sectionId}`})

    return (
        <div
        ref={setNodeRef}
        //{...attributes}
        //{...listeners}
        //className={taskContainer}
        ><div style={{ opacity: 0.5, fontStyle: "italic" }}>Arrastra aquí</div></div>
    )
}

export {Task, TaskPlaceholder}

