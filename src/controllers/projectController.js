import { useDataStore } from "../store/data_store";
import { useCallback } from 'react';
import { createProjectStorage } from "./factories/createProjectStorage";
import { useGlobalTooltip } from "../app/providers/GlobalTooltip";
import { useNavigate } from "react-router-dom";
import { createProjectUseCase, deleteProjectUseCase, updateProjectUseCase } from "../services/projectServices";
import { projectZustandRepository } from "../repositories/projectZustandRepository";
import { storageError, unknownError } from "../utils/errorFunctions";

const useProjectService = () => {
    const { showTooltip } = useGlobalTooltip()
    const projectStorage = createProjectStorage()
    const navigate = useNavigate()

    const redirectToProject = (projectID) => {
        navigate(`/app/project/${projectID}`)
    }


    const createProjectStateAndApi = useCallback(async (data) => {
        try {
            const { project } = createProjectUseCase(
                data,
                projectStorage,
                projectZustandRepository,
                storageError
            )

            showTooltip({
                tooltipText: `Se creo el proyecto ${project.item_name}`,
                buttonText: 'Ir',
                onButtonClick: () => redirectToProject(project.id),
                duration: 3000,
            })

        } catch (error) {
            unknownError(error)
        }
    }, []);


    const updateProjectStateAndApi = useCallback(async (data) => {
        try {
            const project = updateProjectUseCase(
                data,
                projectStorage,
                projectZustandRepository,
                storageError
            )

            showTooltip({
                tooltipText: `Se edito el proyecto ${project.item_name}`,
                duration: 3000,
            })

        } catch (error) {
            unknownError(error)
        }
    }, []);


    const deleteProjectStateAndApi = useCallback(async (id) => {
        try {
            deleteProjectUseCase(id, projectStorage, projectZustandRepository, storageError)

            showTooltip({
                tooltipText: `Proyecto borrado exitosamente!`,
                duration: 3000,
            })

        } catch (error) {
            unknownError(error)
        }
    }, []);


    return {
        createProject: createProjectStateAndApi,
        updateProject: updateProjectStateAndApi,
        deleteProject: deleteProjectStateAndApi,
    };
};

export { useProjectService };
