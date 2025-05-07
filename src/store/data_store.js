import {create} from 'zustand'
import { normalizeData } from '../utils/normalize_data'
import { getStatus } from '../utils/stateUtils'

const useDataStore = create ((set, get) => {
    return({
        projects: {},
        sections: {},
        tasks: {},
        subTasks: {},
        inbox: {},
        unsectionsByProject: {},
        specialProjectsBySpecialId: {},
        colors: [],

        getColorData: (id) => {
            set((state) => {
                const colorData = state.colors.filter((elem) => elem.id == id)
                return (colorData);
            })
        },

        setItems: (itemsFromServices) => {
            return (set(normalizeData(itemsFromServices)))
        },
        changeStatus: (id, newStatusBBody) => {
            set((state) => ({
                tasks: {
                    ...state.tasks,
                    [id]: {
                        ...state.tasks[id],
                        ...newStatusBBody
                    }
                }
        }))
        },
        createTask: (body) => {
            set((state) => {
                const tasksThisSection =  Object.values(state.tasks)
                .filter(item => item.parent_id == body.parent_id)

                return({
                    tasks: {
                        ...state.tasks,
                        [body.id]: {
                            ...body,
                            order: tasksThisSection.length
                        },

                    }
                })
            });
        },

        updateTask: (body) =>
            set((state) => ({
                tasks: {
                    ...state.tasks,
                    [body.id]: {
                        ...state.tasks[body.id],
                        ...body
                    }
                }
        })),
        deleteTask: (id) => {
            set((state) => {
                const copyTaskPrev = Object.values(state.tasks)
                .filter(item => (
                    (item.parent_id == state.tasks[id].parent_id)
                    &&(item.id != id)
                ) )
                .sort((a, b) => a.order - b.order)

                let updateTasks = {...state.tasks}
                delete updateTasks[id]
                copyTaskPrev.forEach((item, index) => {
                    updateTasks[item.id] = {
                        ...item,
                        order: index,
                    }
                  })

                return ({
                    tasks: {
                    ...updateTasks
                    }
                })
            })
        },

        changeSection: (taskId, newSectionParentId, previousParentId) => {
            set((state) => {
                const copyTaskNew = Object.values(state.tasks)
                .filter(item => item.parent_id == newSectionParentId)
                .sort((a, b) => a.order - b.order)

                const copyTaskPrev = Object.values(state.tasks)
                .filter(item => (
                    (item.parent_id == previousParentId)
                    &&(item.id != taskId)) )
                .sort((a, b) => a.order - b.order)

                let updateTasks = {...state.tasks}

                copyTaskPrev.forEach((item, index) => {
                    updateTasks[item.id] = {
                        ...item,
                        order: index,
                    }
                  })

                  console.log('Longitud NewContainer', copyTaskNew.length)

                updateTasks = {
                    ...updateTasks,
                    [taskId]: {
                        ...state.tasks[taskId],
                        order: copyTaskNew.length,
                        parent_id: newSectionParentId
                    }
                }

                return {
                    tasks: {
                        ...updateTasks
                    },
                }
            })
        },

        swapTaskOrder: (id1, id2, parent_id) => {
            set((state) => {
              const task1 = state.tasks[id1];
              const task2 = state.tasks[id2];

              if (!task1 || !task2) {
                return state;
              }
              const copyTask = Object.values(state.tasks)
              .filter(item => item.parent_id == parent_id)
              .sort((a, b) => a.order - b.order)

              const withoutDragged = copyTask.filter((item) => item.id !== id1)
              const overIndex = copyTask.findIndex((item) => item.id == id2)
              //console.log(overIndex)
              //console.log('without', withoutDragged)
              withoutDragged.splice(overIndex, 0, task1)

              const updateTasks = {...state.tasks}
              //console.log('withoutOrder', withoutDragged)


              withoutDragged.forEach((item, index) => {
                updateTasks[item.id] = {
                    ...item,
                    order: index,
                }
              })

              return {
                tasks: {
                  ...updateTasks
                },
              };
            });
          },

        createProject: (body) => {//al momento de crear un projecto, debo crear un unsection (deberia usar una plantilla?)
            //debo tambien hacer algunos cambios en el servicio del backend



            set((state) => {
                const projectsInUser =  Object.values(state.projects);

                return({
                    projects: {
                        ...state.projects,
                        [body.id]: {
                            ...body,
                            order: projectsInUser.length
                        },
                    }
                })
            });

            // esto como lo llamo?createSection()
        },

        createSection: (body) => {
            set((state) => {
                const sectionsInProject =  Object.values(state.sections)
                .filter(item => item.parent_id == body.parent_id)

                return({
                    sections: {
                        ...state.sections,
                        [body.id]: {
                            ...body,
                            order: sectionsInProject.length
                        }
                    }
                })
            });
        },

        deleteSection: (id) => {
            set((state) => {
                const copySectionPrev = Object.values(state.sections)
                .filter(item => (
                    (item.parent_id == state.sections[id].parent_id)
                    &&(item.id != id)
                ) )
                .sort((a, b) => a.order - b.order)

                let updateSections = {...state.sections}
                delete updateSections[id]

                copySectionPrev.forEach((item, index) => {
                    updateSections[item.id] = {
                        ...item,
                        order: index,
                    }
                  })
                //deberia de borrar las tareas de la seccion en el estado temporal?
                return ({
                    sections: {
                    ...updateSections
                    }
                })
            })
        },

        updateSection: (body) =>
            set((state) => ({
                sections: {
                    ...state.sections,
                    [body.id]: {
                        ...state.sections[body.id],
                        ...body
                    }
                }
        })),

        updateProject: (body) =>
            set((state) => ({
                projects: {
                    ...state.projects,
                    [body.id]: {
                        ...state.projects[body.id],
                        ...body
                    }
                }
        })),

        deleteProject: (id) => {//cambiar
            set((state) => {
                const copyProjectsPrev = Object.values(state.projects)
                .filter(item => (item.id != id) )
                .sort((a, b) => a.order - b.order)

                let updateProjects = {...state.projects}
                delete updateProjects[id]

                copyProjectsPrev.forEach((item, index) => {
                    updateProjects[item.id] = {
                        ...item,
                        order: index,
                    }
                  })
                //deberia de borrar las tareas del projecto en el estado temporal?
                return ({
                    projects: {
                    ...updateProjects
                    }
                })
            })
        },

})})

export {useDataStore}
