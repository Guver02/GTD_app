import { useDataStore } from "../store/data_store";
import { useCallback } from 'react';
import { Section } from "../constructors/Items/Sections";
import { createSectionStorage } from "./factories/createSectionStorage";
import { useGlobalTooltip } from "../app/providers/GlobalTooltip";



const useSectionService = () => {
    const createSection = useDataStore(state => state.createSection);
    const updateSection = useDataStore(state => state.updateSection);
    const deleteSection = useDataStore(state => state.deleteSection);
    const { showTooltip } = useGlobalTooltip()
    const sectionStorage = createSectionStorage()
    const createSectionStateAndApi = useCallback(async (data) => {
        try {
            const section = Section.getSection(data);
            createSection(section);

            showTooltip({
                tooltipText: `Se creo la seccion ${section.item_name}`,
                duration: 3000,
            })

            await sectionStorage.create(section)
        } catch (error) {
            alert(`Error en sectionService`)
        }
    }, [createSection]);

    const updateSectionStateAndApi = useCallback(async (data) => {
        const section = Section.getSection(data);
        updateSection(section);
        await sectionStorage.update(section);
    }, [updateSection]);

    const deleteSectionStateAndApi = useCallback(async (id) => {
        deleteSection(id);
        await sectionStorage.delete(id);
    }, [deleteSection]);

    return {
        createSection: createSectionStateAndApi,
        updateSection: updateSectionStateAndApi,
        deleteSection: deleteSectionStateAndApi,
    };
};

export { useSectionService };
