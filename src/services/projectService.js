import { useDataStore } from "../store/data_store";
import { useCallback } from 'react';
import { Project } from '../constructors/Items/Projects';
import { Section } from "../constructors/Items/Sections";

import { projectRestApiRepository } from "../repositories/projectRestApiRepository";
import { sectionRestApiRepository } from "../repositories/sectionRestApiRepository";
import { createProjectStorage } from "./factories/createProjectStorage";

const projectStorage = createProjectStorage()

const useProjectService = () => {
  const createProject = useDataStore(state => state.createProject);
  const createSection = useDataStore(state => state.createSection);
  const deleteProject = useDataStore(state => state.deleteProject);
  const updateProject = useDataStore(state => state.updateProject);
  const addUnsection = useDataStore(state => state.addUnsection);

  const createProjectStateAndApi = useCallback(async (data) => {
    const project = Project.getProject(data);
    createProject(project);

    const unsectionBaseData = { parent_id: project.id };
    const unsection = Section.getUnsectioned(unsectionBaseData);
    createSection(unsection);
    addUnsection(unsection);

    await projectStorage.create(project, unsection.id);

  }, [createProject, createSection]);

  const updateProjectStateAndApi = useCallback(async (data) => {
    const project = Project.getProject(data);
    console.log(project)
    updateProject(project);
    await projectStorage.update(project);
  }, [updateProject]);

  const deleteProjectStateAndApi = useCallback(async (id) => {
    deleteProject(id);
    await projectStorage.delete(id);
  }, [deleteProject]);

  return {
    createProject: createProjectStateAndApi,
    updateProject: updateProjectStateAndApi,
    deleteProject: deleteProjectStateAndApi,
  };
};

export { useProjectService };
///*await sectionRestApiRepository.create(unsection)*/
