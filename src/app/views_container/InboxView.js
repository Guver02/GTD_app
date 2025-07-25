import React from "react";
import { TaskList } from "../task_components/TaskList";
import { Task } from "../task_components/Task";
import { useDataStore } from "../../store/data_store";
import * as styles from './InboxView.module.css'
import { useLanguage } from "../custom_hooks/useLanguage";

const {
    inboxView,
    inboxContainer,
    tittle,
    sectionInbox,
    scrollableContainer,
    listsContainer,
    sectionTittle,
    sectionsContainer
} = styles;

function InboxView() {
    const inbox = useDataStore((state) => state.inbox);
    const unsectionsByProject = useDataStore((state) => state.unsectionsByProject);
    const tasks = useDataStore((state) => state.tasks);
    const {translation} = useLanguage()

    const allTasks = () => {
        return Object.values(tasks)
        .sort((a, b) => a.order - b.order)
        .map((task) => task.id)
    }

    const tasksPending = () => {
        return Object.values(tasks)
            .filter((task) =>
                (task.parent_id === unsectionsByProject[inbox.id].id) &&
                (task.is_next === false))
            .sort((a, b) => a.order - b.order)
            .map((task) => task.id)
    }

    const tasksInProgress = () => {
        return Object.values(tasks)
            .filter((task) =>
                (task.parent_id === unsectionsByProject[inbox.id].id) &&
                (task.is_next === true))
            .sort((a, b) => a.order - b.order)
            .map((task) => task.id)
    }

    const tasksCompleted = () => {
        return Object.values(tasks)
            .filter((task) =>
                (task.parent_id === unsectionsByProject[inbox.id].id) &&
                (task.status === 'completed'))
            .sort((a, b) => a.order - b.order)
            .map((task) => task.id)
    }

    const tasksPendingIDs = tasksPending()
    const tasksInProgressIDs = tasksInProgress()
    const tasksCompletedIDs = tasksCompleted()
    const allTasksIDs = allTasks()


    return (
        <div className={inboxView}>
            <div className={inboxContainer}>

                <span className={tittle}>{translation.inbox}</span>


                <div className={sectionsContainer}>
                    <div className={scrollableContainer}>
                        <div className={listsContainer}>
                            <div className={sectionInbox}>
                                <span className={sectionTittle}>{translation.unclearTasks}</span>
                                <TaskList taskIds={tasksPendingIDs} TaskComponent={Task} isMove={false}></TaskList>
                            </div>
                            <div className={sectionInbox}>
                                <span className={sectionTittle}>{translation.clarifiedTasks}</span>
                                <TaskList taskIds={tasksInProgressIDs} TaskComponent={Task} isMove={false}></TaskList>
                            </div>
                            <div className={sectionInbox}>
                                <span className={sectionTittle}>{translation.completedTasks}</span>
                                <TaskList taskIds={tasksCompletedIDs} TaskComponent={Task} isMove={false}></TaskList>
                            </div>
                            <div className={sectionInbox}>
                                <span className={sectionTittle}>{translation.inbox}</span>
                                <TaskList taskIds={allTasksIDs} TaskComponent={Task} isMove={false}></TaskList>
                            </div>
                        </div>
                    </div>
                </div>



            </div>
        </div>
    )
}

export { InboxView }
