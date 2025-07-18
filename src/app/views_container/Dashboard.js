import React, { useContext, useEffect, useState } from "react";
import * as styles from './Dashboard.module.css';
import { FastForward, UserPlus } from 'lucide-react';
import { useDataStore } from "../../store/data_store";
import { jwtDecode } from "jwt-decode";
import { ModalContext } from "../providers/ModalContext";
import { CreateTask } from '../task_components/CreateTask';
import { CreateProject } from '../projects_components/CreateProject';
import { HoverModal } from "../ui_components/HoverModal";
import { ProfileOptions } from "../ui_components/ProfileOptions";
import { TaskList } from "../task_components/TaskList";
import { NextTask } from "../task_components/NextTask";
import { FilterModal } from "../ui_components/FilterModal";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { useProjectByTaskID } from "../custom_hooks/useGetProject";

const {
    dashboardContainer,
    header,
    headerLeft,
    userWelcome,
    headerRight,
    actionButtons,
    scheduleButton,
    createRequestButton,
    userIcon,
    nextActionHeader,
    nextActionContainer,
    boardContainer,
    listsContainer,
    columnContainer,
    columnTittle
} = styles;

function Dashboard() {
    const tasks = useDataStore(state => state.tasks);
    const sections = useDataStore(state => state.sections);
    const projects = useDataStore(state => state.projects);
    const [filters, setFilters] = useState([]);
    const [filteredTaskIds, setFilteredTaskIds] = useState({
        pending: [],
        in_progress: [],
        completed: [],
    });

    const { openModal } = useContext(ModalContext);
    const token = AppConfigManager.getToken();
    const decoded = jwtDecode(token);

    const addFilter = (unsectionedId, projectId) => {
        setFilters(prev => [...prev, { unsectionedId, projectId }]);
    };

    const removeFilter = (projectId) => {
        setFilters(prev => prev.filter(elem => elem.projectId !== projectId));
    };

    useEffect(() => {
        const tasksArray = Object.values(tasks).filter(t => t.is_next);
        const pending = [];
        const inProgress = [];
        const completed = [];

        for (const task of tasksArray) {
            const section = sections[task.parent_id];
            if (!section) continue;

            const projectId = section.parent_id;
            const project = projects[projectId];
            if (!project) continue;

            const isFiltered =
                filters.length === 0 ||
                filters.some(f => f.projectId === projectId);

            if (!isFiltered) continue;

            if (task.status === 'pending') pending.push(task);
            else if (task.status === 'in_progress') inProgress.push(task);
            else if (task.status === 'completed') completed.push(task);
        }

        const sortByOrder = arr => arr.sort((a, b) => a.order - b.order).map(t => t.id);

        setFilteredTaskIds({
            pending: sortByOrder(pending),
            in_progress: sortByOrder(inProgress),
            completed: sortByOrder(completed),
        });
    }, [filters, tasks, sections, projects]);

    return (
        <div className={dashboardContainer}>
            <header className={header}>
                <div className={headerLeft}>
                    <HoverModal
                        ParentComponent={<div className={userIcon}><UserPlus /></div>}
                        bubbleComponent={() => <ProfileOptions />}
                        position="bottom"
                    />
                    <div className={userWelcome}>
                        <h1>{decoded.username}</h1>
                        <p>Bienvenido de nuevo</p>
                    </div>
                </div>

                <div className={headerRight}>

                </div>
            </header>

            <div className={nextActionContainer}>
                <div className={nextActionHeader}>
                    <h3><FastForward size={16} className="inline-icon" />Next Actions</h3>
                    <FilterModal
                        addFilter={addFilter}
                        removeFilter={removeFilter}
                        filters={filters}
                    />
                </div>

                <div className={boardContainer}>
                    <div className={listsContainer}>
                        <div className={columnContainer}>
                            <span className={columnTittle}>Pending</span>
                            <TaskList taskIds={filteredTaskIds.pending} TaskComponent={NextTask} isMove={false} />
                        </div>
                        <div className={columnContainer}>
                            <span className={columnTittle}>In Progress</span>
                            <TaskList taskIds={filteredTaskIds.in_progress} TaskComponent={NextTask} isMove={false} />
                        </div>
                        <div className={columnContainer}>
                            <span className={columnTittle}>Done</span>
                            <TaskList taskIds={filteredTaskIds.completed} TaskComponent={NextTask} isMove={false} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export { Dashboard };
