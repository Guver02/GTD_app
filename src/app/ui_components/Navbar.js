import React, { useContext, useState } from 'react';
import * as styles from './Navbar.module.css';
import { ModalContext } from '../providers/ModalContext';
import { MainPanel } from './MainPanel';
import { Bell, Moon, Plus, User } from 'lucide-react';

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
                <button
                className={createButton}
                onClick={handleCreate}>
                    <span>Create</span>
                    <Plus/>
                </button>
            </div>

            <div className={navbarRight}>

                <button>
                    <Bell/>
                </button>

                <button>
                    <Moon/>
                </button>

                <button>
                    <User/>
                </button>

            </div>
        </nav>
    );
};

export { Navbar };
