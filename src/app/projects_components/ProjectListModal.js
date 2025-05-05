import React from 'react';
import { useDataStore } from '../../store/data_store';
import { shallow } from 'zustand/shallow';
import * as style from './ProjectListModal.module.css';
import { Folder } from 'react-feather';
import { Project } from './Project';

const {
    projectsListContainer,
    projectsList
} = style

function ProjectListModal({onClickProject}) {
    const projects = useDataStore((state) => state.projects, shallow)
    const arrFolders = Object.values(projects)
    console.log(projects)
  return (
    <div
    className={projectsListContainer}>
      <span>Lista de Carpetas</span>
      <ul className={projectsList}>
        {arrFolders.map((project) => (
          <Project
          key={project.id}
          project={project}
          onClickProject={onClickProject}
          />
        ))}
      </ul>
    </div>
  );
}

export {ProjectListModal}
