import { Project } from "../domain/Project";
import { Section } from "../domain/Section";


const createSectionUseCase = (sectionData, sectionStorage, sectionState, onError) => {
    const section = Section.createSection(sectionData)

    sectionState.create(section)

    void sectionStorage.create(section)
    .catch(( err ) => {
        onError(err)
    })

    return section
}

const updateSectionUseCase = (sectionData, sectionStorage, sectionState, onError) => {
    const updatedSection = Section.createSection(sectionData)
    updatedSection.update(sectionData)

    sectionState.update(updatedSection)

    void sectionStorage.update(updatedSection)
    .catch((err) => {
        onError(err)
    })

    return updatedSection
}

const deleteSectionUseCase = (id, sectionStorage, sectionState, onError) => {
    sectionState.delete(id)

    void sectionStorage.delete(id)
    .catch((err) => {
        onError(err)
    })
}

export { createSectionUseCase, updateSectionUseCase, deleteSectionUseCase }
