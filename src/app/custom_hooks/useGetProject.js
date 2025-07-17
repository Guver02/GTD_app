import React from "react";
import { useDataStore } from "../../store/data_store";

function useProjectByTaskID(taskId) {
    const task = useDataStore((state) => state.tasks[taskId]);
    const section = useDataStore((state) => state.sections[task.parent_id]);
    const project = useDataStore((state) => state.projects[section.parent_id]);

    return (project)
}

export { useProjectByTaskID }
