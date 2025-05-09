import React, { useContext } from 'react';
import { useDataStore } from '../../store/data_store';
import { shallow } from 'zustand/shallow';
import * as style from './ProjectListModal.module.css';
import { Folder, Plus } from 'react-feather';
import { Project } from './Project';
import { ModalContext } from '../providers/ModalContext';
import { CreateProject } from './CreateProject';

const {
    projectsListContainer,
    projectsList,
    createButton
} = style

function ProjectListModal({onClickProject}) {
    const projects = useDataStore((state) => state.projects)
    const arrFolders = Object.values(projects)
    .filter(project => project.special_type_id == null)
    const {openModal} = useContext(ModalContext)

    const handleCreate = () => {
        console.log('se clicko')
        openModal(<CreateProject/>)
    }

  return (
    <div
    className={projectsListContainer}>
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
            <Plus></Plus>
            <span>Crear Proyecto en Lista</span>
        </li>
      </ul>
    </div>
  );
}

export {ProjectListModal}
