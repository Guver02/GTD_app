import React, { useContext } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './Task.module.css'
import { CheckCircle, Circle, CircleCheck, CircleDashed, ClockFading, MoreVertical, Sun } from 'lucide-react';
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Move2 } from "../utils_component/Move2";
import { useTaskService } from "../../controllers/taskController";
import { HoverModal } from "../ui_components/HoverModal";
import { TaskOptions } from "./TaskOptions";
import { StatusOptions } from "./StatusOptions";
import { useLanguage } from "../custom_hooks/useLanguage";

const {
    taskContainer,
    taskContent,
    content,
    description,
    iconsContainer,
    container,
    moveIcon,
    optionsContainer,
    placeholderContainer,
    nextActionContainer,
    taskCenter,
    taskTop,
    statusContent
} = style

const Task = React.memo(({ taskId, isMove = true }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging } = useSortable({ id: taskId, });

    const { openModal } = useContext(ModalContext)
    const task = useDataStore((state) => state.tasks[taskId]);
    const { changeStatus, updateTask, setNextAction, setNextActionState } = useTaskService()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleNextAction = () => {
        if (!task.is_next) {
            setNextActionState(taskId, true)
        } else {
            setNextActionState(taskId, false)
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
            is_next={task.is_next}
        />)
    };

    const handleCheckIsPending = () => {
        changeStatus(taskId, false)
    }
    const handleCheckIsCompleted = () => {
        changeStatus(taskId, true)
    }

    const status = {
        pending: <div
            className={statusContent}
            style={{
                backgroundColor: 'rgba(139, 142, 147, 0.15)',
                color: 'rgba(139, 142, 147, 1)'
            }}
        >
            <CircleDashed
                color={`rgba(139, 142, 147, 1)`}
            />
            <span>Pending</span>
        </div>,
        in_progress: <div
            className={statusContent}
            style={{
                backgroundColor: 'rgba(217, 117, 59, 0.15)',
                color: 'rgba(217, 117, 59, 1)'
            }}
        >
            <ClockFading
                color={`rgba(217, 117, 59, 1)`}
            />
            <span>In Progress</span>
        </div>,
        completed: <div
            className={statusContent}
            style={{
                backgroundColor: 'rgba(3, 140, 76, 0.15)',
                color: 'rgba(3, 140, 76, 1)'
            }}
        >
            <CircleCheck
                color={`rgba(3, 140, 76, 1)`}
            />
            <span>Completed</span>
        </div>,
    }

    if (!task) return null;
    return (
        <div
            ref={setNodeRef}
            {...attributes}
            className={container}
            style={style}
        >
            {isMove ?
                <div
                    className={moveIcon}
                    {...listeners}>
                    <Move2 />
                </div>
                :
                <div className={moveIcon}></div>
            }

            <div
                className={taskContainer}
                style={{ borderLeft: `${task.myColor.id !== 1 ? '4px ' : '0'} solid rgba(${task.myColor.color}, 1)` }}>

                <div className={taskTop}>

                    <HoverModal
                    ParentComponent={status[task.status]}
                    bubbleComponent={(onClose) => <StatusOptions
                    id={taskId}
                    onClose={onClose}/>}
                    position="top"
                    alignment="start"
                    />

                    <div>
                        {(task.status == 'completed') &&
                            <CheckCircle onClick={handleCheckIsPending} />
                        }
                        {(task.status == 'in_progress') &&
                            <Circle onClick={handleCheckIsCompleted} />
                        }
                        {(task.status == 'pending') &&
                            <Circle onClick={handleCheckIsCompleted} />
                        }
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
                        <span className={description}>
                            {task.order}
                        </span>

                    </div>



                </div>

                {task.is_next &&
                    <div className={iconsContainer}>
                        <div></div>
                        <div>
                            {task.is_next &&
                                <div className={nextActionContainer}>
                                    <span>Acción siguiente</span>
                                    <Sun />
                                </div>
                            }
                        </div>
                    </div>

                }
            </div>

            <div className={optionsContainer}>
                <HoverModal
                    ParentComponent={
                        <div>
                            <MoreVertical />
                        </div>}
                    bubbleComponent={(closeModal) => (
                        <TaskOptions
                            id={taskId}
                            onClose={closeModal}
                            onEdit={handleClick}
                            onNextAction={handleNextAction}
                        />)}
                    position='left'
                    alignment="center"
                    />
            </div>

        </div>
    );
})


function TaskPlaceholder({ sectionId }) {
    const { setNodeRef } = useSortable({ id: `placeholder-${sectionId}` })
    const {translation} = useLanguage()

    return (
        <div
            ref={setNodeRef}
            className={placeholderContainer}
        >
            <span>{translation.emptySection}</span>
        </div>
    )
}

export { Task, TaskPlaceholder }

