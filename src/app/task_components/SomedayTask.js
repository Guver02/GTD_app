import React, { useContext, useRef, useState } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './SomedayTask.module.css'
import { ArrowDownCircle, CheckCircle, Circle, Crosshair, Inbox, Trash2 } from "react-feather";
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useTaskService } from "../../controllers/taskService";

const {
   taskContainer,
   taskItem,
   content,
   taskContent,
   description,
   iconsContainer,
   optionsContainer
} = style

const SomedayTask = React.memo(({ taskId, isMove = true }) => {
    const {openModal} = useContext(ModalContext)
    const task = useDataStore((state) => state.tasks[taskId]);
    const {changeStatus} = useTaskService()

    const handleClick = () => {
        openModal(<ViewTask
            id = {taskId}
            itemName = {task.item_name}
            description = {task.description}
            parent_id={task.parent_id}
            order={task.order}
            />)
    };


    if (!task) return null;

    return (
        <div className={taskContainer}>

            <div
            className={taskItem}
            onClick={handleClick}
            style={{backgroundColor: `rgba(${task.myColor.color}, 0.1)`}}
            >
                <div className={taskContent}>
                    <span
                    className={content}
                    style={{color: `rgba(${task.myColor.color}, 1)`}}
                    >
                    {task.item_name}
                    </span>
                    <span className={description}>
                    {task.description}
                    </span>
                    <div className={iconsContainer}>

                    </div>
                </div>

                <div className={optionsContainer}>
                    <ArrowDownCircle/>
                    <Inbox/>
                    <Trash2/>
                </div>

            </div>

        </div>
    );
})

export {SomedayTask}
