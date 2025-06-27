import React from 'react';
import * as styles from './Sidebar.module.css';
import { Search, Briefcase, AlignJustify, Hexagon, ArrowDownCircle } from 'react-feather'
import { HoverModal } from './HoverModal';
import { ProjectListModal } from '../projects_components/ProjectListModal';
import { useWidth } from '../custom_hooks/useWidth';
import { useSidebarLogic } from './useSidebarLogic';

const {
    sidebar,
    sidebarExpanded,
    iconButton,
    logoContainer,
    logo,
    logoText,
    menuItem,
    menuText,
    itemActive,
    menuItemExpanded
} = styles;

const Sidebar = () => {
    const {
        isExpanded,
        activeItem,
        menuItems,

        showProjects,
        toggleSidebar,
        handleSearch,
        handleClarify,
        handleNavigate
    } = useSidebarLogic()

    const { width } = useWidth();

    return (

        <aside
            data-testid="sidebar"
            role="complementary"
            className={`${sidebar} ${isExpanded ? sidebarExpanded : ''}`}>
            <div
                className={iconButton}
                data-testid="toggle-sidebar"
                onClick={toggleSidebar}>
                <AlignJustify />
            </div>

            <div className={logoContainer}>
                <div className={logo}><Hexagon /></div>
                {isExpanded && <div className={logoText}>Pointsale</div>}
            </div>

            <div
                className={isExpanded ? menuItemExpanded : menuItem}
                onClick={handleSearch}
            >
                <Search />
                {isExpanded && <div className={menuText}>Quick Search</div>}
            </div>

            <div
                className={isExpanded ? menuItemExpanded : menuItem}
                onClick={handleClarify}
            >
                <ArrowDownCircle />
                {isExpanded && <div className={menuText}>Clarify</div>}
            </div>

            {isExpanded && <div className={menuText}>Menu</div>}

            <div
                className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem == 'project' ? itemActive : ''}`}
                onClick={showProjects}
            >
                <Briefcase />
                {isExpanded && <div className={menuText}>Projects</div>}
            </div>

            {menuItems.map(({ icon, label, path, key }) => (
                <div
                    key={label}
                    className={`${isExpanded ? menuItemExpanded : menuItem} ${activeItem === key ? itemActive : ''}`}
                    onClick={() => handleNavigate(path)}
                >
                    {icon}
                    {isExpanded && <div className={menuText}>{label}</div>}
                </div>
            ))}

        </aside>
    );
};

export { Sidebar };
