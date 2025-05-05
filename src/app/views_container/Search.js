import React, { useState } from 'react';
import * as styles from './Search.module.css';
import { Inbox, Home, Calendar, Hash, Tag } from 'react-feather'; // Example icons
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

        <div className={recentlyViewedSection}>
          <h2 className={sectionTitle}>Visto recientemente</h2>
          <div className={menuItem}>
            <Inbox className={icon} />
            <span className={itemText}>Bandeja de entrada</span>
          </div>
          <div className={menuItem}>
            <Calendar className={icon} />
            <span className={itemText}>Hoy</span>
            <span className={shortcut}>G luego T</span>
          </div>
          <div className={menuItem}>
            <Hash className={icon} />
            <span className={itemText}>Today</span>
            <span className={shortcut}>G Mis Proyectos</span>
          </div>
        </div>

        <div className={navigationSection}>
          <h2 className={sectionTitle}>Navegación</h2>
          <div className={menuItem}>
            <Home className={icon} />
            <span className={itemText}>Ir a Inicio</span>
            <span className={shortcut}>G luego H</span>
          </div>
          <div className={menuItem}>
            <Inbox className={icon} />
            <span className={itemText}>Ir a Bandeja de entrada</span>
            <span className={shortcut}>G luego I</span>
          </div>
          <div className={menuItem}>
            <Calendar className={icon} />
            <span className={itemText}>Ir a Hoy</span>
            <span className={shortcut}>G luego T</span>
          </div>
          <div className={menuItem}>
            {/* You might use a different icon here */}
            <Tag className={icon} />
            <span className={itemText}>Ir a Próximo</span>
            <span className={shortcut}>G luego U</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Ir a Filtros y Etiquetas</span>
            <span className={shortcut}>G luego V</span>
          </div>
          {/* Add more navigation items as needed */}
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 1</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 2</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 3</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 4</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 5</span>
          </div>
          <div className={menuItem}>
            <Tag className={icon} />
            <span className={itemText}>Opción Adicional 6</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export {SearchModal};
