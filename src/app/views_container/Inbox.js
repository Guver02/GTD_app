import React from "react";
import { TaskList } from "../task_components/TaskList";
import { Task } from "../task_components/Task";
import { useDataStore } from "../../store/data_store";

function Inbox () {
    const {inbox, unsectionsByProject} = useDataStore((state) => state);
    //const unsectionsByProject = useDataStore((state) => state.unsectionsByProject);
    const tasks = useDataStore((state) => state.tasks);

    const getTaskFromInbox = (obj) => {
        return Object.values(obj)
        .filter((task) => task.parent_id === unsectionsByProject[inbox.id].id)
        .sort((a, b) => a.order - b.order)
        .map((task) => task.id)
    }

    const taskIds = getTaskFromInbox(tasks)

    return (
        <div>
            <span>Inbox</span>
            {/*<pre>
                {
                    JSON.stringify(tasks, null, 2)
                }
            </pre>*/}
            <TaskList taskIds={taskIds} TaskComponent={Task}></TaskList>
        </div>
    )
}

export {Inbox}
