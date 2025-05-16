import React, { useContext, useEffect, useState } from 'react';
import * as styles from './Sidebar.module.css';
import {Search, Inbox, Bell, Grid, Briefcase, Users, Trello, Calendar, Archive, Trash2, AlignJustify, Codepen, Codesandbox, Hexagon, ArrowDownCircle, Coffee, UserCheck, FileText} from 'react-feather'
import { HoverModal } from './HoverModal';
import { ProjectListModal } from '../projects_components/ProjectListModal';
import { useLocation, useNavigate } from 'react-router-dom';
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
    sidebarContainer,
    sidebarContainerExpanded,
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
    itemActive,
    itemProjects,
    menuItemExpanded
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
    const [width, setWidth] = useState(window.innerWidth);
    const [activeItem, setActiveItem] = useState(null);

    const location = useLocation()
    const navigate = useNavigate();
    const {openModal} = useContext(ModalContext)

    const project = useDataStore((state) => state.specialProjectsBySpecialId[specialTypesIDS.inbox])
    const unsectionedInbox = useDataStore(state => state.unsectionsByProject[project.id])

    console.log(activeItem)

    useEffect(() => {
        const thisLocation = location.pathname.split("/")
        setActiveItem(thisLocation[2])
    }, [location])

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
            className={isExpanded ? menuItemExpanded : menuItem}
            onClick={handleSearch}
            >
                <Search/>
                {isExpanded && <div className={menuText}>Quick Search</div>}
            </div>

            <div className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == undefined ? itemActive : ''}`}
                onClick={redirectToInbox}
            >
                <Inbox/>
                {isExpanded && <div className={menuText}>Inbox</div>}
            </div>



            {isExpanded && <div className={menuText}>Menu</div>}



            <HoverModal
            ParentComponent={
            <div
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'project' ? itemActive : ''}`}
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
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'dashboard' ? itemActive : ''}`}
            onClick={handleDashboard}
            >
                <Grid/>
                {isExpanded && <div className={menuText}>Dashboard</div>}
            </div>

            <div
            className={isExpanded ? menuItemExpanded : menuItem}
            onClick={handleClarify}
            >
                <ArrowDownCircle/>
                {isExpanded && <div className={menuText}>Clarify</div>}
            </div>

            <div
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'someday' ? itemActive : ''}`}
            onClick={handleSomeday}
            >
                <Coffee/>
                {isExpanded && <div className={menuText}>Someday</div>}
            </div>

            <div
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'traking-file' ? itemActive : ''}`}
            onClick={handleTrakingFile}
            >
                <Archive/>
                {isExpanded && <div className={menuText}>Tracking File</div>}
            </div>

            <div
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'waiting' ? itemActive : ''}`}
            onClick={handleWaiting}
            >
                <UserCheck/>
                {isExpanded && <div className={menuText}>Waiting</div>}
            </div>

            <div
            className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'reference-file' ? itemActive : ''}`}
            onClick={handleReferenceFile}
            >
                <FileText/>
                {isExpanded && <div className={menuText}>Reference File</div>}
            </div>
            </aside>
    );
};

export {Sidebar};
