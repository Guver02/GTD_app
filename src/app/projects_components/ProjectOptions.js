import React from "react"
import * as style from '../section_components/SectionOptions.module.css'
import { useProjectService } from "../../controllers/projectController"
import { useLanguage } from "../custom_hooks/useLanguage"

const  {
    sectionOptionsContainer,
    sectionOptionsList

} = style

function ProjectOptions ({id, closeOptions, deleteFunction, editFunction}) {
    const {deleteProject} = useProjectService()

    const {translation} = useLanguage()

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
                {translation.delete}
            </li>
            <li
            onClick={handleEdit}
            >
                {translation.edit}
            </li>
        </ul>
    </div>)
}

export {ProjectOptions}
