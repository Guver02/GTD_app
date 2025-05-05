import { useDataStore } from "../store/data_store";
import { apiService } from "./apiService";
import { useCallback } from 'react'; // Importa useCallback para optimizar
import { Project } from '../constructors/Items/Projects'
import { Section } from "../constructors/Items/Sections";


const useSectionService = () => {
    const createSection = useDataStore((state) => state.createSection);
    const deleteSection = useDataStore((state) => state.deleteSection)
    const updateSection = useDataStore((state) => state.updateSection)

    const createSectionStateAndApi = useCallback(async (data) => {

        const sectionData = Section.getSection(data);
        createSection(sectionData)

        await apiService.post(`/api/v1/items/create-section`, sectionData.getSectionFormatAPI());
    }, [createSection]);

    const updateSectionStateAndApi = useCallback(async (body) => {
        const updateSectionData = Section.getSection(body);
        updateSection(updateSectionData);

        await apiService.put(`/api/v1/items/update-content/${body.id}`, updateSectionData.getUpdateContentFormatAPI())
    }, [updateSection])

    const deleteSectionStateAndApi = useCallback(async (id) => {
        deleteSection(id)

        await apiService.delete(`/api/v1/items/delete/${id}`);
    }, [deleteSection])

  return {
    createSection: createSectionStateAndApi,
    deleteSection: deleteSectionStateAndApi,
    updateSection: updateSectionStateAndApi
  };
};

export { useSectionService };
