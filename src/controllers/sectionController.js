import { useCallback, useMemo } from 'react';
import { createSectionStorage } from "./factories/createSectionStorage";
import { useGlobalTooltip } from "../app/providers/GlobalTooltip";
import { createSectionUseCase, deleteSectionUseCase, updateSectionUseCase } from "../services/sectionServices";
import { sectionZustandRepository } from "../repositories/sectionZustandRepository";
import { storageError, unknownError } from "../utils/errorFunctions";



const useSectionService = () => {
    const { showTooltip } = useGlobalTooltip()
    const sectionStorage = useMemo(() => createSectionStorage(), [])

    const createSectionStateAndApi = useCallback(async (data) => {
        try {
            const section = createSectionUseCase(data, sectionStorage, sectionZustandRepository, storageError)

            showTooltip({
                tooltipText: `Se creo la seccion ${section.item_name}`,
                duration: 3000,
            })

        } catch (error) {
            unknownError(error)
        }

    }, []);

    const updateSectionStateAndApi = useCallback(async (data) => {
        try {
            const section = updateSectionUseCase(data, sectionStorage, sectionZustandRepository, storageError)

            showTooltip({
                tooltipText: `Se edito la sección ${section.item_name}`,
                duration: 3000,
            })

        } catch (error) {
            unknownError(error)
        }

    }, []);

    const deleteSectionStateAndApi = useCallback(async (id) => {
        try {
            deleteSectionUseCase(id, sectionStorage, sectionZustandRepository, storageError)

            showTooltip({
                tooltipText: `Se elimino la sección!`,
                duration: 3000,
            })
        } catch (error) {
            unknownError(error)
        }
    }, []);

    return {
        createSection: createSectionStateAndApi,
        updateSection: updateSectionStateAndApi,
        deleteSection: deleteSectionStateAndApi,
    };
};

export { useSectionService };
