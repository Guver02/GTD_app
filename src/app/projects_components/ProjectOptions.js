import React from "react"
import * as style from '../section_components/SectionOptions.module.css'
import { useProjectService } from "../../controllers/projectController"

const  {
    sectionOptionsContainer,
    sectionOptionsList

} = style

function ProjectOptions ({id, closeOptions, deleteFunction, editFunction}) {
    const {deleteProject} = useProjectService()


    const handleDelete = () => {
        deleteFunction()
    }

    const handleEdit = () => {
        editFunction()
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
                Delete
            </li>
            <li
            onClick={handleEdit}
            >
                Edit
            </li>
        </ul>
    </div>)
}

export {ProjectOptions}
