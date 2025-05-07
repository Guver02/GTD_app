function normalizeData (data){
    try {
        return({
            projects: data.folders.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
            sections: data.sections.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
            tasks: data.todos.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
            subTasks: data.subTodos.reduce((acc, item) => ({ ...acc, [item.id]: item }), {}),
            inbox: data.inbox,

            specialProjectsBySpecialId: data.specialProjects.reduce((acc, item) => ({ ...acc, [item.special_type_id]: item }), {}),

            unsectionsByProject: data.unsections.reduce((acc, item) => ({ ...acc, [item.parent_id]: item }), {}),
            colors: data.colors,
        })
    } catch (error) {
        console.log(error)

    }

}

export {normalizeData};
