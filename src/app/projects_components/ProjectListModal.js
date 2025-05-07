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
    const projects = useDataStore((state) => state.projects)
    const arrFolders = Object.values(projects)
    .filter(project => project.special_type_id == null)
    console.log(projects)
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
      </ul>
    </div>
  );
}

export {ProjectListModal}
