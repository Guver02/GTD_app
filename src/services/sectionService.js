import { useDataStore } from "../store/data_store";
import { useCallback } from 'react';
import { Section } from "../constructors/Items/Sections";
import { createSectionStorage } from "./factories/createSectionStorage";

const sectionStorage = createSectionStorage()

const useSectionService = () => {
  const createSection = useDataStore(state => state.createSection);
  const updateSection = useDataStore(state => state.updateSection);
  const deleteSection = useDataStore(state => state.deleteSection);


  const createSectionStateAndApi = useCallback(async (data) => {
    const section = Section.getSection(data);
    createSection(section);
    await sectionStorage.create(section)
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
