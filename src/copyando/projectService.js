import { useDataStore } from "../store/data_store";
import { useCallback } from 'react';
import { Project } from '../constructors/Items/Projects';
import { Section } from "../constructors/Items/Sections";
import { createProjectStorage } from "./factories/createProjectStorage";
import { useGlobalTooltip } from "../app/providers/GlobalTooltip";
import { useNavigate } from "react-router-dom";




const useProjectService = () => {
    const { showTooltip } = useGlobalTooltip()

    const createProject = useDataStore(state => state.createProject);
    const createSection = useDataStore(state => state.createSection);
    const deleteProject = useDataStore(state => state.deleteProject);
    const updateProject = useDataStore(state => state.updateProject);
    const addUnsection = useDataStore(state => state.addUnsection);
const projectStorage = createProjectStorage()
const navigate = useNavigate()
    const createProjectStateAndApi = useCallback(async (data) => {

        try {


            const project = Project.getProject(data);

            const redirectToProject = () => {
                navigate(`/app/project/${project.id}`)
            }

            createProject(project);
            const unsectionBaseData = { parent_id: project.id };
            const unsection = Section.getUnsectioned(unsectionBaseData);

            createSection(unsection);
            addUnsection(unsection);

            showTooltip({
                tooltipText: `Se creo el proyecto ${project.item_name}`,
                buttonText: 'Ir',
                onButtonClick: redirectToProject,
                duration: 3000,
            })

            await projectStorage.create(project, unsection.id);
        } catch (error) {
            alert(`Error en projectService`)
        }

    }, [createProject, createSection, showTooltip]);

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
