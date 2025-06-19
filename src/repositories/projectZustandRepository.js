import { useDataStore } from "../store/data_store"

const projectZustandRepository = {
    create: (project, unsection) => {
        const store = useDataStore.getState()
        store.createProject(project)
        store.createSection(unsection)
        store.addUnsection(unsection)
    },

    update: (projectData) => {
        const store = useDataStore.getState()
        store.updateProject(projectData)
    },

    delete: (id) => {
        const store = useDataStore.getState()
        store.deleteProject(id)
    }
}

export { projectZustandRepository }
