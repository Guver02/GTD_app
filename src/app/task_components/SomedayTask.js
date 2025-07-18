import React, { useContext, useRef, useState } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './SomedayTask.module.css'
import {
    MoveVertical,
    Sun,
    Trash,
    Edit,
    Copy,
    CheckSquare,
    Flag,
    Clock,
    Archive, ArrowDownCircle, CalendarArrowDown, CheckCircle, Circle, CircleCheck, CircleDashed, ClockFading, Crosshair, Inbox, Trash2
} from 'lucide-react';
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useTaskService } from "../../controllers/taskController";
import { useProjectByTaskID } from "../custom_hooks/useGetProject";
import { StatusOptions } from "./StatusOptions";
import { HoverModal } from "../ui_components/HoverModal";
import { TimeStatusCircle } from "../utils_component/TimeStatusCircle";
import { LifeCycleBadge } from "../utils_component/LifeCycleBadge,";

const {
    taskContainer,
    taskItem,
    content,
    taskContent,
    description,
    iconsContainer,
    optionsContainer,
    taskTop,
    quickActionsContainer,
    statusContent,
    nextActionContainer,
    textContainer,

    buttonList,
    actionButton
} = style

function formatShortDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date)) return null

    return date.toISOString().split('T')[0]
}

const SomedayTask = React.memo(({ taskId, isMove = true }) => {
    const { openModal } = useContext(ModalContext)
    const task = useDataStore((state) => state.tasks[taskId]);
    const { changeStatus } = useTaskService()

    const dateCreated = formatShortDate(task.created_at);

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
        <div className={taskContainer}
        >

            <div
                className={taskItem}
                onClick={handleClick}>

                <div className={taskTop}>



                    <HoverModal
                        ParentComponent={status[task.status]}
                        bubbleComponent={(onClose) => <StatusOptions
                            id={taskId}
                            onClose={onClose} />}
                        position="top"
                        alignment="start"
                    />
                </div>

                <div className={taskContent}>

                    <div className={textContainer}>
                        <span
                            className={content}>
                            {task.item_name}
                        </span>
                        <span className={description}>
                            {task.description || 'Esribe una descripción aquí...'}
                        </span>
                    </div>



                    <div className={iconsContainer}>

                        <LifeCycleBadge item={task} />
                        <TimeStatusCircle createdAt={task.created_at} />
                    </div>
                </div>

                <div className={optionsContainer}>
                    <div></div>

                    <div className={nextActionContainer}>
                        <CalendarArrowDown />
                        <span>{dateCreated}</span>
                    </div>
                </div>

            </div>

            <div
                className={quickActionsContainer}
            >
                <div className={buttonList}>
                    <button className={actionButton}>
                        <MoveVertical size={16} />

                        <span>        Mover a
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Sun size={16} />

                        <span>        Aclarar
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Trash size={16} />

                        <span>        Eliminar
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Edit size={16} />

                        Editar
                        <span>
                        </span>      </button>
                    <button className={actionButton}>
                        <Copy size={16} />

                        <span>        Duplicar
                        </span>
                    </button>
                    <button className={actionButton}>
                        <CheckSquare size={16} />

                        <span>        Marcar como completada
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Flag size={16} />

                        <span>        Prioridad
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Clock size={16} />

                        <span>        Agendar
                        </span>
                    </button>
                    <button className={actionButton}>
                        <Archive size={16} />

                        <span>        Archivar
                        </span>
                    </button>
                </div>
            </div>

        </div>
    );
})

export { SomedayTask }
