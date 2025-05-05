import React from "react"
import * as style from './SectionOptions.module.css'
import { useSectionService } from "../../services/sectionService"

const  {
    sectionOptionsContainer,
    sectionOptionsList

} = style

function SectionOptions ({id, closeOptions, editMode}) {
    const {deleteSection} = useSectionService()


    const handleDelete = () => {
        deleteSection(id)
        closeOptions()
    }

    const handleEdit = () => {
        editMode(true)
        closeOptions()
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

export {SectionOptions}
