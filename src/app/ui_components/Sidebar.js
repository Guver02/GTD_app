import React, { useContext, useEffect, useState } from 'react';
import * as styles from './Sidebar.module.css';
import {Search, Inbox, Bell, Grid, Briefcase, Users, Trello, Calendar, Archive, Trash2, AlignJustify, Codepen, Codesandbox, Hexagon, ArrowDownCircle, Coffee, UserCheck, FileText} from 'react-feather'
import { HoverModal } from './HoverModal';
import { ProjectListModal } from '../projects_components/ProjectListModal';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../providers/ModalContext';
import { SearchModal } from '../views_container/Search';
import { Clarify } from '../views_container/Clarify';
import { useDataStore } from '../../store/data_store';

const {
    sidebar,
    sidebarExpanded,
    iconButton,
    logoContainer,
    logo,
    logoText,
    searchBar,
    menuItem,
    menuText,
    currentPlan,
    upgradeButton,
    preferencesContainer,
    preferenceItem,
    userInfo,
    userInfoText,
    userInfoChevron,
} = styles;
const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
  };

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();
    const {openModal} = useContext(ModalContext)
    const project = useDataStore((state) =>
        state.specialProjectsBySpecialId[specialTypesIDS.inbox])
    const unsectionedInbox = useDataStore(state => state.unsectionsByProject[project.id])
    const [width, setWidth] = useState(window.innerWidth);
    console.log(width)

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
      }, []);

    const redirectToProject = (projectID) => {
        navigate(`/app/project/${projectID}`)
    }
    const redirectToInbox = () => {
        navigate(`/app`)
    }
    const handleDashboard = () => {
        navigate(`/app/dashboard`)
    }
    const handleSomeday = () => {
        navigate(`/app/someday`)
    }
    const handleTrakingFile = () => {
        navigate(`/app/traking-file`)
    }
    const handleWaiting = () => {
        navigate(`/app/waiting`)
    }
    const handleReferenceFile = () => {
        navigate(`/app/reference-file`)
    }
    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };
    const handleSearch = () => {
        openModal(<SearchModal/>);
    }
    const handleClarify = () => {
        openModal(<Clarify sectionToClarifyID={unsectionedInbox.id}/>);
    }

    return (
        <aside className={`${sidebar} ${isExpanded ? sidebarExpanded : ''}`}>
            <div className={iconButton} onClick={toggleSidebar}>
                <AlignJustify/>
            </div>

            <div className={logoContainer}>
                <div className={logo}><Hexagon/></div>
                {isExpanded && <div className={logoText}>Pointsale</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleSearch}
            >
                <Search/>
                {isExpanded && <div className={menuText}>Quick Search</div>}
            </div>

            <div className={menuItem}
                onClick={redirectToInbox}
            >
                <Inbox/>
                {isExpanded && <div className={menuText}>Inbox 12</div>}
            </div>



            {isExpanded && <div className={menuText}>Menu</div>}



            <HoverModal
            ParentComponent={
            <div
            className={menuItem}
            >
                <Briefcase/>
                {isExpanded && <div className={menuText}>Projects</div>}
            </div>
            }
            bubbleComponent={() => (
            <ProjectListModal
            onClickProject={redirectToProject}/>)}
            position={(width <= 768)? 'top' : 'right'}
            gap={12}/>


            <div
            className={menuItem}
            onClick={handleDashboard}
            >
                <Grid/>
                {isExpanded && <div className={menuText}>Dashboard</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleClarify}
            >
                <ArrowDownCircle/>
                {isExpanded && <div className={menuText}>Clarify</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleSomeday}
            >
                <Coffee/>
                {isExpanded && <div className={menuText}>Someday</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleTrakingFile}
            >
                <Archive/>
                {isExpanded && <div className={menuText}>Tracking File</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleWaiting}
            >
                <UserCheck/>
                {isExpanded && <div className={menuText}>Waiting</div>}
            </div>

            <div
            className={menuItem}
            onClick={handleReferenceFile}
            >
                <FileText/>
                {isExpanded && <div className={menuText}>Reference File</div>}
            </div>
        </aside>
    );
};

export {Sidebar};

/**
 * <div className={menuItem}>
                <Bell/>
                {isExpanded && <div className={menuText}>Notifications 15+</div>}
            </div>

     <div className={menuItem}>
                <Grid/>
                {isExpanded && <div className={menuText}>Dashboard</div>}
            </div>

               <div className={menuItem}>
                <Users/>
                {isExpanded && <div className={menuText}>Colaborators</div>}
            </div>

            <div className={menuItem}>
                <Trello/>
                {isExpanded && <div className={menuText}>Gant</div>}
            </div>

            <div className={menuItem}>
                <Calendar/>
                {isExpanded && <div className={menuText}>Calendar</div>}
            </div>

              <div className={menuItem}>
                <Archive/>
                {isExpanded && <div className={menuText}>Tracking File</div>}
            </div>

            <div className={menuItem}>
                <Trash2/>
                {isExpanded && <div className={menuText}>Trash</div>}
            </div>


            {isExpanded && (
                <div className={currentPlan}>
                    Current plan: <br />
                    Pro trial
                </div>
            )}

            {isExpanded && (
                <div className={currentPlan}>
                    Upgrade to Pro to get the latest and exclusive features
                </div>
            )}

            {isExpanded && <button className={upgradeButton}>+ Upgrade to Pro</button>}

            <div className={menuItem}>
                <div className={iconButton}>O</div>
                {isExpanded && <div className={menuText}>Preferences</div>}
            </div>
 */
