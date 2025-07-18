import React, { useContext, useState } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './NextTask.module.css'
import { ArrowLeft, ArrowRight, CalendarArrowDown, CheckCircle, ChevronLeft, ChevronRight, Circle, CircleCheck, CircleDashed, ClockFading, Folder, MoreHorizontal, MoreVertical, Sun } from 'lucide-react';
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Move2 } from "../utils_component/Move2";
import { useTaskService } from "../../controllers/taskController";
import { HoverModal } from "../ui_components/HoverModal";
import { TaskOptions } from "./TaskOptions";
import { StatusOptions } from "./StatusOptions";
import { useProjectByTaskID } from "../custom_hooks/useGetProject";

function formatShortDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date)) return null

  return date.toISOString().split('T')[0]
}


const {
    taskContainer,
    taskContent,
    content,
    description,
    iconsContainer,
    container,
    nextActionContainer,
    taskCenter,
    taskTop,
    projectContent,
    moveIcons,
    icon,
    iconActive
} = style

const taskStatus = {
    pending: 0,
    in_progress: 1,
    completed: 2,
}
const numbertoStatus = {
    0: 'pending',
    1: 'in_progress',
    2: 'completed',
}

const NextTask = React.memo(({ taskId, isMove = true }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging } = useSortable({ id: taskId, });

    const task = useDataStore((state) => state.tasks[taskId]);
    const project = useProjectByTaskID(task.id);
    const [status, setStatus] = useState(taskStatus[task.status]);

    const { openModal } = useContext(ModalContext)

    const {changeStatus} = useTaskService()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const dateCreated = formatShortDate(task.created_at);


    const moveTaskToPrev = () => {
        if(status > taskStatus.pending){
            setStatus((prevStatus) => prevStatus - 1)
            changeStatus(taskId, numbertoStatus[status - 1])
        }
    }
    const moveTaskToNext = () => {
        if(status < taskStatus.completed){
            setStatus((prevStatus) => prevStatus + 1)
            changeStatus(taskId, numbertoStatus[status + 1])
        }
    }

    const handleClick = () => {
        openModal(<ViewTask
            id={taskId}
            itemName={task.item_name}
            description={task.description}
            parent_id={task.parent_id}
            order={task.order}
            myColor={task.myColor}
        />)
    };

    if (!task) return null;
    return (
        <div ref={setNodeRef}
        {...attributes}
        className={container}
        style={style}>

            <div className={taskContainer} {...listeners}
            style={{ borderLeft: `${task.myColor.id !== 1 ? '4px ' : '0'} solid rgba(${task.myColor.color}, 1)` }}>

                <div className={taskTop}>
                    <HoverModal
                        ParentComponent={<div className={projectContent}
                            style={{ backgroundColor: `rgba(${project.myColor.color}, 0.1)`,

                                boxSizing: 'border-box',
                                color: `rgba(${project.myColor.color}, 1)` }}>
                                <Folder color={`rgba(${project.myColor.color}, 1)`} fill={`rgba(${project.myColor.color}, 1)`}/><span>{project.item_name}</span></div>}

                            bubbleComponent={(onClose) => <StatusOptions
                            id={taskId}
                            onClose={onClose} />}
                        position="top"
                        alignment="start"
                    />

                    <div>
                        <MoreHorizontal/>
                    </div>

                </div>

                <div className={taskCenter}>

                    <div
                        className={taskContent}
                        onClick={handleClick}
                    >
                        <span className={content}>
                            {task.item_name}
                        </span>
                        <span className={description}>
                            {task.description}
                        </span>

                    </div>



                </div>


                    <div className={iconsContainer}>

                        <div className={nextActionContainer}>
                            <CalendarArrowDown/>
                            <span>{dateCreated}</span>
                        </div>

                        <div className={moveIcons}>
                            <div
                            className={`${icon} ${status > taskStatus.pending ? iconActive : ''}`}
                            onClick={moveTaskToPrev}>
                                <ChevronLeft/>
                            </div>
                            <div
                            className={`${icon} ${status < taskStatus.completed ? iconActive : ''}`}
                            onClick={moveTaskToNext}>
                                <ChevronRight/>
                            </div>
                        </div>

                    </div>

            </div>

        </div>
    );
})

export { NextTask }
