import React, { useContext } from 'react';
import { useDataStore } from '../../store/data_store';
import * as style from './ProjectListModal.module.css';
import { Project } from './Project';
import { ModalContext } from '../providers/ModalContext';
import { CreateProject } from './CreateProject';
import { Plus } from 'lucide-react';
import { useLanguage } from '../custom_hooks/useLanguage';

const {
    projectsListContainer,
    projectsList,
    createButton,
    projectListTittle
} = style

function ProjectListModal({onClickProject}) {
    const projects = useDataStore((state) => state.projects)
    const arrFolders = Object.values(projects)
    .filter(project => project.special_type_id == null)
    const {translation} = useLanguage()
    const {openModal} = useContext(ModalContext)

    const handleCreate = () => {
        openModal(<CreateProject/>)
    }

  return (
    <div className={projectsListContainer}>

        <span className={projectListTittle}>
            {`${arrFolders.length} ${translation.projects}`}
        </span>

      <ul className={projectsList}>
        {arrFolders.map((project) => (
          <Project
          key={project.id}
          project={project}
          onClickProject={onClickProject}
          />
        ))}

        <li
        className={createButton}
        onClick={handleCreate}
        >
            <Plus/>
            <span>{translation.createProject}</span>
        </li>

      </ul>

    </div>
  );
}

export {ProjectListModal}
