import React from "react";
import { Folder, MoreHorizontal, MoreVertical } from 'lucide-react';
import * as styles from './Project.module.css'
import { useLanguage } from "../custom_hooks/useLanguage";

const {
    projectContainer,
    contentContainer,
    rightIconContainer,
    leftContainer,
    moreIconContainer,
    folderIconContainer
} = styles

function Project({ project, onClickProject }) {
    const {translation} = useLanguage()

    const iconProjectStyle = {
        color: `rgb(${project.myColor.color})`
    }

    return (
        <li
        className={projectContainer}>

            <div className={leftContainer}
            onClick={() => onClickProject(`/app/project/${project.id}`)}>
                <div className={folderIconContainer}>
                    <Folder
                    style={iconProjectStyle}/>
                </div>

                <div className={contentContainer}>
                    <span>{`${project.item_name} ${project.order}`}</span>
                </div>
            </div>

            <div className={rightIconContainer}>
                <div className={moreIconContainer}>
                    <MoreHorizontal/>
                </div>
            </div>

        </li>
    )
}

export { Project }
