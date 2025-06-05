import React, { useContext, useState } from 'react';
import * as styles from './Navbar.module.css';
import { ModalContext } from '../providers/ModalContext';
import { MainPanel } from './MainPanel';
import { Plus } from 'react-feather';

const Navbar = () => {
    const {openModal} = useContext(ModalContext)

    const {
        navbar,
        navbarCenter,
        navbarRight,
        createButton,
    } = styles;

    const handleCreate = () => {
        openModal(<MainPanel/>)
    }

    return (
        <nav className={navbar}>

            <div className={navbarCenter}>
            </div>

            <div className={navbarRight}>
                <button
                className={createButton}
                onClick={handleCreate}>
                    <span>Create</span>
                    <Plus/>
                </button>
            </div>
        </nav>
    );
};

export { Navbar };
