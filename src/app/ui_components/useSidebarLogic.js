import { useState, useEffect, useContext } from 'react';
import { Inbox, Grid, Archive, Coffee, UserCheck, FileText } from 'react-feather'
import { useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from '../providers/ModalContext';
import { SearchModal } from '../views_container/Search';
import { Clarify } from '../views_container/Clarify';

function useSidebarLogic() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { openModal } = useContext(ModalContext);

    const menuItems = [
        { icon: <Inbox />, label: 'Inbox', path: '/app/inbox', key: 'inbox' },
        { icon: <Grid />, label: 'Dashboard', path: '/app/dashboard', key: 'dashboard' },
        { icon: <Coffee />, label: 'Someday', path: '/app/someday', key: 'someday' },
        { icon: <Archive />, label: 'Tracking File', path: '/app/traking-file', key: 'traking-file' },
        { icon: <UserCheck />, label: 'Waiting', path: '/app/waiting', key: 'waiting' },
        { icon: <FileText />, label: 'Reference File', path: '/app/reference-file', key: 'reference-file' },
    ];

    useEffect(() => {
        console.log('Location changed:', location.pathname); // Añade esto
        const segments = location.pathname.split('/').filter(Boolean);
        console.log('Segments:', segments); // Y esto
        setActiveItem(segments[1]);
        console.log('Active item set to:', segments[1]); // Y esto
    }, [location]);

    const handleNavigate = (path) => {
        navigate(path)
    };
    const toggleSidebar = () => setIsExpanded(prev => !prev);
    const handleSearch = () => openModal(<SearchModal/>);
    const handleClarify = () => openModal(<Clarify/>);


    return {
        isExpanded,
        activeItem,
        menuItems,

        toggleSidebar,
        handleSearch,
        handleClarify,
        handleNavigate
    };
};

export { useSidebarLogic }
