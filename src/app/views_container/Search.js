import React, { useState } from 'react';
import * as styles from './Search.module.css';
import { Inbox, Home, Calendar, Hash, Tag, Coffee, FileText } from 'lucide-react'; // Example icons
import { useDataStore } from '../../store/data_store';
import { Task } from '../task_components/Task';
import { Project } from '../projects_components/Project';
import { useNavigate } from 'react-router-dom';

const {
  sidebarContainer,
  searchBar,
  recentlyViewedSection,
  sectionTitle,
  menuItem,
  icon,
  itemText,
  shortcut,
  navigationSection,
  scrollableContainer,
  tasksSection
} = styles;

function SearchModal () {
    const [search, setSearch] = useState('')
    const [filterTasks, setFilterTasks] = useState([])
    const [filterProject, setFilterProject] = useState([])
    const tasks = useDataStore((state) => state.tasks)
    const projects = useDataStore((state) => state.projects)

    const arrayTasks = Object.values(tasks)
    const arrayProjects = Object.values(projects)


    const handleChangue = (e) => {
        setSearch(e.target.value);
        if (e.target.value == ''){
            setFilterTasks([]);
            setFilterProject([])
            return
        }
        const tasksFiltered = arrayTasks.filter(task => task.item_name.toLowerCase().includes(e.target.value.toLowerCase()));
        const projectsFiltered = arrayProjects.filter(project => project.item_name.toLowerCase().includes(e.target.value.toLowerCase()));

        setFilterTasks(tasksFiltered)
        setFilterProject(projectsFiltered)
    }


    const navigate = useNavigate()

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

  return (
    <div className={sidebarContainer}>
      <div className={searchBar}>
        <input
        type="text"
        placeholder="Busca o escribe un comando..."
        value={search}
        onChange={(e) => handleChangue(e)}
        />
        <span>Ctrl K</span>
      </div>

      <div className={scrollableContainer}>

        {(filterTasks.length > 0) &&
        <div className={tasksSection}>
            <h2 className={sectionTitle}>Tareas</h2>
            {
                filterTasks.map((item) =><Task key={item.id} taskId={item.id} isMove={false}/> )
            }
        </div>
        }

        {(filterProject.length > 0) &&
        <div className={tasksSection}>
            <h2 className={sectionTitle}>Proyectos</h2>
            {
                filterProject.map((item) =><Project key={item.id} project={item} onClickProject={redirectToProject}/> )
            }
        </div>
        }

        <div className={navigationSection}>
          <h2 className={sectionTitle}>Navegación</h2>
          <div
          className={menuItem}
          onClick={handleDashboard}
          >
            <Home className={icon} />
            <span className={itemText}>Ir a Inicio</span>
            <span className={shortcut}>G luego H</span>
          </div>

          <div className={menuItem}
          onClick={redirectToInbox}
          >
            <Inbox className={icon} />
            <span className={itemText}>Ir a Bandeja de entrada</span>
            <span className={shortcut}>G luego I</span>
          </div>

          <div className={menuItem}
          onClick={handleSomeday}
          >
            <Coffee className={icon} />
            <span className={itemText}>Ir a Algún día/ Quizás</span>
            <span className={shortcut}>G luego T</span>
          </div>

            <div className={menuItem}
            onClick={handleReferenceFile}
            >
            <FileText className={icon} />
            <span className={itemText}>Ir al Archivo de Referencia</span>
            <span className={shortcut}>G luego T</span>
            </div>

        </div>
      </div>
    </div>
  );
};

export {SearchModal};
