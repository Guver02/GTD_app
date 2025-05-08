import { useDataStore } from "../store/data_store";
import { apiService } from "./apiService";
import { useCallback } from 'react'; // Importa useCallback para optimizar
import { Project } from '../constructors/Items/Projects'
import { Section } from "../constructors/Items/Sections";


const useProjectService = () => {
    const createProject = useDataStore((state) => state.createProject);
    const createSection = useDataStore((state) => state.createSection);
    const deleteProject = useDataStore((state) => state.deleteProject);
    const updateProject = useDataStore((state) => state.updateProject);

    const createProjectStateAndApi = useCallback(async (data) => {

        const projectData = Project.getProject(data);
        createProject(projectData)
        const unsectionBaseData = {
            parent_id: projectData.id
        }
        createSection(Section.getUnsectioned(unsectionBaseData))

        await apiService.post(`/api/v1/items/create-folder`, projectData.getProjectFormatAPI());
    }, [createProject]);


    const updateProjectStateAndApi = useCallback(async (body) => {
        const updateProjectData = Project.getProject(body);
        updateProject(updateProjectData);

        await apiService.put(`/api/v1/items/update-content/${body.id}`, updateProjectData.getUpdateContentFormatAPI())
    }, [updateProject])

    const deleteProjectStateAndApi = useCallback(async (id) => {
        deleteProject(id)

        await apiService.delete(`/api/v1/items/delete-project/${id}`)
    }, [deleteProject])

  return {
    createProject: createProjectStateAndApi,
    updateProject: updateProjectStateAndApi,
    deleteProject: deleteProjectStateAndApi
  };
};

export { useProjectService };
