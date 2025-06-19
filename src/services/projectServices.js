import { Project } from "../domain/Project";
import { Section } from "../domain/Section";


const createProjectUseCase = (projectData, projectStorage, projectState, onError) => {
    const project = Project.createProject(projectData)
    const unsection = Section.createUnsectioned(project.id)

    projectState.create(project, unsection)

    void projectStorage.create(project, unsection.id)
    .catch(( err ) => {
        onError(err)
    })

    return {project, unsection}
}

const updateProjectUseCase = (projectData, projectStorage, projectState, onError) => {
    const updatedProject = Project.createProject(projectData)
    updatedProject.update(projectData)
    projectState.update(updatedProject)

    void projectStorage.update(updatedProject)
    .catch((err) => {
        onError(err)
    })

    return updatedProject
}

const deleteProjectUseCase = (id, projectStorage, projectState, onError) => {
    projectState.delete(id)

    void projectStorage.delete(id)
    .catch((err) => {
        onError(err)
    })
}

export { createProjectUseCase, updateProjectUseCase, deleteProjectUseCase }
