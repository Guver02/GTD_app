import React, { useContext, useEffect, useState } from "react";
import * as styles from './Dashboard.module.css';
import { Bell, Calendar, Plus, Search, Clock, FileText, Users, Flag, CheckCircle, XCircle, MinusCircle, Circle, AlertCircle, FastForward, LogOut, UserPlus, CalendarArrowDown, MoreVerticalIcon } from 'lucide-react'; // Importa más iconos según sea necesario
import { useDataStore } from "../../store/data_store";
import { useTaskService } from "../../controllers/taskController";
import { FilterModal } from "../ui_components/FilterModal";
import { jwtDecode } from "jwt-decode";
import { ModalContext } from "../providers/ModalContext";
import { CreateTask } from '../task_components/CreateTask';
import { CreateProject } from '../projects_components/CreateProject';
import { useNavigate } from "react-router-dom";
import { createAuthSesion } from "../../factories/createAuthSesion";
import { AppConfigManager } from "../../manager/AppConfigManager";
import { useAuthController } from "../../controllers/authController";


const {
    dashboardContainer,
    header,
    headerLeft,
    userWelcome,
    headerRight,
    actionButtons,
    scheduleButton,
    createRequestButton,
    widgetsContainer,
    widget,
    widgetHeader,
    widgetBody,
    notesList,
    noteItem,
    noteContainer,
    circleIcon,
    userIcon,
    bottomItem,
    rigthBottom,
    topItem,
    topLeft,
    topRight,
    contentItem,
    tittleItem,
    progressContent
} = styles;

function formatDate(dateISO) {
    const date = new Date(dateISO);

    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}


function Dashboard() {
    const tasks = useDataStore(state => state.tasks)
    console.log(tasks)
    const [nextTasks, setNextTasks] = useState([])
    const navigate = useNavigate()
    const { logout } = useAuthController()

    const [filters, setFilters] = useState([])
    const { openModal } = useContext(ModalContext)

    const addFilter = (unsectionedId, projectId) => {
        setFilters((prev) => [
            ...prev,
            {
                unsectionedId,
                projectId
            }])
    }

    const removeFilter = (projectId) => {
        setFilters((prev) => prev.filter(elem => elem.projectId !== projectId))
    }

    const token = AppConfigManager.getToken()
    const decoded = jwtDecode(token);


    useEffect(() => {
        if (filters.length > 0) {
            const unsectionedFiltered = filters.map(elem => elem.unsectionedId)
            setNextTasks(
                Object.values(tasks)
                    .filter(task => task.status === 'in_progress')
                    .filter(elem => unsectionedFiltered.includes(elem.parent_id))
            )
        } else if (filters.length == 0) {
            setNextTasks(
                Object.values(tasks)
                    .filter(task => task.status === 'in_progress'))
        }
    }, [filters, tasks])

    const handleCreateTask = () => {
        openModal(<CreateTask />)
    }

    const handleCreateProject = () => {
        openModal(<CreateProject />)
    }

    const logoutUser = () => {
        /* const authSesion = createAuthSesion()
        authSesion.logout()
        navigate('/auth/login') */

        logout()
        navigate('/auth/login')
    }

    return (
        <div className={dashboardContainer}>

            <header className={header}>

                <div className={headerLeft}>
                    <div className={userIcon}>
                        <UserPlus />
                    </div>
                    <div className={userWelcome}>
                        <h1>{`${decoded.username}`}</h1>
                        <p>Bienvenido de nuevo</p>
                    </div>
                </div>

                <div className={headerRight}>

                    <div className={actionButtons}>
                        <button
                            className={scheduleButton}
                            onClick={handleCreateProject}>
                            Create Project
                        </button>
                        <button
                            className={createRequestButton}
                            onClick={handleCreateTask}>
                            Create Task
                        </button>
                    </div>

                </div>
            </header>

            <div className={widgetsContainer}>

                <div className={widget}>

                    <div className={widgetHeader}>
                        <h3><FastForward size={16} className="inline-icon" />Next Actions</h3>


                        <FilterModal
                            addFilter={addFilter}
                            removeFilter={removeFilter}
                            filters={filters}
                        />


                    </div>

                    <div className={widgetBody}>

                        <div className={notesList}>
                            {
                                nextTasks.map((task) => (
                                    <NextTaskItem key={task.id} taskId={task.id} />
                                ))
                            }
                        </div>
                    </div>

                </div>


            </div>

        </div>
    );
}

function NextTaskItem({ taskId }) {
    const task = useDataStore(state => state.tasks[taskId])
    const sections = useDataStore(state => state.sections)
    const projects = useDataStore(state => state.projects)
    const [check, setCheck] = useState(task.status)
    const { changeStatus } = useTaskService()
    const date = formatDate(task.created_at);
    const handleCheck = () => {
        changeStatus(taskId, true)
    }
    const color = projects[sections[task.parent_id].parent_id].myColor.color;

    return (
        <div className={noteContainer}>
            <div className={noteItem}>

                <div className={topItem}>
                    <div className={topLeft}>
                        <span
                        className={styles.noteTag}
                        style={{
                            backgroundColor: `rgba(${color},0.2)`,
                            color: `rgba(${color},1)`,
                        }}>

                        {projects[sections[task.parent_id].parent_id].item_name}
                    </span>
                    </div>
                    <div className={topRight}>
                        <MoreVerticalIcon/>
                    </div>
                </div>


                <div className={contentItem}>

                    <div>
                    <strong className={tittleItem}>{task.item_name}</strong>
                    <p>{task.description}</p>
                    </div>

                    <div className={progressContent}>
                    {check == 'in_progress' ?
                        <Circle
                            className={circleIcon}
                            onClick={handleCheck}
                        />
                        :
                        <AlertCircle
                        />
                    }
                    </div>

                </div>

                <div className={bottomItem}>
                    <div></div>
                    <div className={rigthBottom}>
                        <CalendarArrowDown />
                        <span>{date}</span>
                    </div>
                </div>

            </div>

        </div>
    )
}

export { Dashboard };
