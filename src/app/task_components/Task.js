import React, { useContext } from "react";
import { useDataStore } from "../../store/data_store";
import * as style from './Task.module.css'
import { CheckCircle, Circle, MoreVertical, Sun } from "react-feather";
import { ModalContext } from "../providers/ModalContext";
import { ViewTask } from "./ViewTask";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Move2 } from "../utils_component/Move2";
import { useTaskService } from "../../controllers/taskController";
import { HoverModal } from "../ui_components/HoverModal";
import { TaskOptions } from "./TaskOptions";

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
    nextActionContainer
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
    const {changeStatus, updateTask, setNextAction} = useTaskService()

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    const handleNextAction = () => {
        if(task.status !== 'in_progress'){
            setNextAction(taskId)

        }else{
            changeStatus(taskId, false)

        }
    }

    const handleClick = () => {
        openModal(<ViewTask
            id = {taskId}
            itemName = {task.item_name}
            description = {task.description}
            parent_id={task.parent_id}
            order={task.order}
            myColor={task.myColor}
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
        {isMove ?
            <div
            className={moveIcon}
            {...listeners}>
                <Move2/>
            </div>
            :
            <div className={moveIcon}></div>
        }

        <div
        className={taskContainer}
        style={{borderLeft: `${task.myColor.id !== 1 ? '4px ' : '0'} solid rgba(${task.myColor.color}, 1)`}}>

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
                    <div></div>
                    <div>
                        {task.status == 'in_progress' &&
                            <div className={nextActionContainer}>
                                <span>Acción siguiente</span>
                                <Sun/>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div>
            {(task.status == 'completed') &&
            <CheckCircle onClick={handleCheckIsPending}/>
            }
            {(task.status == 'in_progress') &&
            <Circle onClick={handleCheckIsCompleted}/>
            }
            {(task.status == 'pending') &&
            <Circle onClick={handleCheckIsCompleted}/>
            }
            </div>
        </div>

        <div className={optionsContainer}>
            <HoverModal
            ParentComponent={
            <div>
                <MoreVertical/>
            </div>}
            bubbleComponent={(closeModal) => (
            <TaskOptions
            id={taskId}
            onClose={closeModal}
            onEdit={handleClick}
            onNextAction={handleNextAction}
            />)}
            position='left'
            gap={4}/>
        </div>

      </div>
    );
})


function TaskPlaceholder({sectionId}){
    const {setNodeRef} = useSortable({id: `placeholder-${sectionId}`})

    return (
        <div
        ref={setNodeRef}
        className={placeholderContainer}
        >
            <span>Sección vacía</span>
        </div>
    )
}

export {Task, TaskPlaceholder}

