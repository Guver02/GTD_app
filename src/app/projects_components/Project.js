import React from "react";
import { Folder } from "react-feather";
import * as styles from './Project.module.css'

const {
    projectContainer
} = styles

function Project ({project, onClickProject}) {


    return(
        <li className={projectContainer}
        onClick={() => onClickProject(`/app/project/${project.id}`)}
        >
            <Folder
            style={{
            color: `rgb(${project.myColor.color})`
                    }}
                    />
            <span>{project.item_name}</span>
            <span>{project.order}</span>
        </li>
    )
}

export {Project}
