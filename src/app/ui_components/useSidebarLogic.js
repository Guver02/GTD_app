import { useState, useEffect, useContext } from 'react';
import { Inbox, Grid, Archive, Coffee, UserCheck, FileText } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from '../providers/ModalContext';
import { SearchModal } from '../views_container/Search';
import { Clarify } from '../views_container/Clarify';
import { ProjectListModal } from '../projects_components/ProjectListModal';

function useSidebarLogic() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { openModal, closeModal} = useContext(ModalContext);

    const menuItems = [
        { icon: <Inbox />, label: 'Inbox', path: '/app/inbox', key: 'inbox' },
        { icon: <Grid />, label: 'Dashboard', path: '/app/dashboard', key: 'dashboard' },
        { icon: <Coffee />, label: 'Someday', path: '/app/someday', key: 'someday' },
        { icon: <Archive />, label: 'Tracking File', path: '/app/traking-file', key: 'traking-file' },
        { icon: <UserCheck />, label: 'Waiting', path: '/app/waiting', key: 'waiting' },
        { icon: <FileText />, label: 'Reference File', path: '/app/reference-file', key: 'reference-file' },
    ];

    useEffect(() => {
        const segments = location.pathname.split('/').filter(Boolean);
        setActiveItem(segments[1]);
    }, [location]);

    const showProjects = () => {
        openModal(<ProjectListModal onClickProject={handleNavigate} />)
    }
    const handleNavigate = (path) => {
        navigate(path)
        closeModal()
    };
    const toggleSidebar = () => setIsExpanded(prev => !prev);
    const handleSearch = () => openModal(<SearchModal/>);
    const handleClarify = () => openModal(<Clarify/>);


    return {
        isExpanded,
        activeItem,
        menuItems,

        showProjects,
        toggleSidebar,
        handleSearch,
        handleClarify,
        handleNavigate
    };
};

export { useSidebarLogic }
