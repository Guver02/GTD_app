import React from "react"
import * as style from '../section_components/SectionOptions.module.css'
import { useTaskService } from "../../services/taskService"
import { Edit, Sun, Trash2 } from "react-feather"

const  {
    sectionOptionsContainer,
    sectionOptionsList

} = style

function TaskOptions ({id, closeOptions, editFunction, handleNextAction}) {
    const {deleteTask, updateTask} = useTaskService()

    const handleEdit = () => {
        editFunction()
        closeOptions()
    }

    const handleDelete = () => {
        deleteTask(id)
        closeOptions()
    }

    const handleNext = () => {
        handleNextAction()
    }

    return(<div className={sectionOptionsContainer}>
        <ul
        onPointerDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}

        className={sectionOptionsList}>
            <li
            onClick={handleDelete}>
                <Trash2/>
                <span>Delete</span>
            </li>
            <li
            onClick={handleEdit}
            >
                <Edit/>
                <span>Edit</span>
            </li>
            <li
            onClick={handleNext}>
                <Sun/>
                <span>Accion siguiente</span>
            </li>
        </ul>
    </div>)
}

export {TaskOptions}
