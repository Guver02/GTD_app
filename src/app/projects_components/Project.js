import React from "react";
import { Folder } from "react-feather";
import * as styles from './Project.module.css'

const {
    projectContainer,
    contentContainer,
    iconContainer
} = styles

function Project({ project, onClickProject }) {


    return (
        <li className={projectContainer}
            onClick={() => onClickProject(`/app/project/${project.id}`)}
        >
            <div>
                <Folder
                    style={{
                        color: `rgb(${project.myColor.color})`
                    }}
                />
            </div>
            <div className={contentContainer}>
                <span>{`${project.item_name} ${project.order}`}</span>
            </div>
        </li>
    )
}

export { Project }
