import React, { useContext, useState } from 'react';
import * as styles from './Navbar.module.css';
import { ModalContext } from '../providers/ModalContext';
import { CreateTask } from '../task_components/CreateTask';
import { CreateProject } from '../projects_components/CreateProject';

const Navbar = () => {
    const {openModal} = useContext(ModalContext)

    const {
        navbar,
        navbarCenter,

        navbarRight,
        createButton,
    } = styles;

    const handleCProject = () => {
        openModal(<CreateProject/>)
    }


    const handleCTask = () => {
        openModal(<CreateTask/>)
    }

    return (
        <nav className={navbar}>

            <div className={navbarCenter}>
            </div>

            <div className={navbarRight}>
                <button
                className={createButton}
                onClick={handleCProject}
                >Create Project</button>
                <button
                className={createButton}
                onClick={handleCTask}
                >Create Task</button>
            </div>
        </nav>
    );
};

export { Navbar };
