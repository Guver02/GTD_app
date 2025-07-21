import React, { useContext, useState } from 'react';
import * as styles from './Navbar.module.css';
import { ModalContext } from '../providers/ModalContext';
import { MainPanel } from './MainPanel';
import { Bell, Moon, Plus, User, UserPlus } from 'lucide-react';
import { HoverModal } from './HoverModal';
import { ProfileOptions } from './ProfileOptions';
import { useLanguage } from '../custom_hooks/useLanguage';

const Navbar = () => {
    const {openModal} = useContext(ModalContext)
    const {translation} = useLanguage()

    const {
        navbar,
        navbarCenter,
        navbarRight,
        createButton,
        userIcon
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
                    <span>{translation.create}</span>
                    <Plus/>
                </button>
            </div>

            <div className={navbarRight}>

                <HoverModal
                        ParentComponent={<div className={userIcon}><UserPlus/></div>}
                        bubbleComponent={() => <ProfileOptions />}
                        position="bottom"
                        alignment='end'
                    />

            </div>
        </nav>
    );
};

export { Navbar };
