import { useDataStore } from "../store/data_store"

const sectionZustandRepository = {
    create: (section) => {
        const store = useDataStore.getState()
        store.createSection(section)
    },

    update: (projectData) => {
        const store = useDataStore.getState()
        store.updateSection(projectData)
    },

    delete: (id) => {
        const store = useDataStore.getState()
        store.deleteSection(id)
    }
}

export { sectionZustandRepository }
