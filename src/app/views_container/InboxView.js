import React from "react";
import { TaskList } from "../task_components/TaskList";
import { Task } from "../task_components/Task";
import { useDataStore } from "../../store/data_store";
import * as styles from './InboxView.module.css'

const {
    inboxContainer,
    tittle,
    scrollableContainer,
    listsContainer
} = styles;

function InboxView () {
    const inbox = useDataStore((state) => state.inbox);
    const unsectionsByProject = useDataStore((state) => state.unsectionsByProject);
    const tasks = useDataStore((state) => state.tasks);

    const tasksPending = () => {
        return Object.values(tasks)
        .filter((task) =>
            (task.parent_id === unsectionsByProject[inbox.id].id) &&
            (task.status === 'pending'))
        .sort((a, b) => a.order - b.order)
        .map((task) => task.id)
    }

    const tasksInProgress = () => {
        return Object.values(tasks)
        .filter((task) =>
            (task.parent_id === unsectionsByProject[inbox.id].id) &&
            (task.status === 'in_progress'))
        .sort((a, b) => a.order - b.order)
        .map((task) => task.id)
    }

    const tasksPendingIDs = tasksPending()
    const tasksInProgressIDs = tasksInProgress()

    return (
        <div className={inboxContainer}>
            <span className={tittle}>Inbox</span>
            <div className={scrollableContainer}>
                <div className={listsContainer}>
                <TaskList taskIds={tasksPendingIDs} TaskComponent={Task}></TaskList>
                <TaskList taskIds={tasksInProgressIDs} TaskComponent={Task}></TaskList>
                </div>
            </div>
        </div>
    )
}

export {InboxView}
