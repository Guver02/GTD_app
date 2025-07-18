import React from "react";
import { TaskList } from "../task_components/TaskList";
import { useDataStore } from "../../store/data_store";
import * as styles from './Someday.module.css'
import { SomedayTask } from "../task_components/SomedayTask";

const {
    somedayView,
    somedayContainer,
    tittle,
    scrollableContainer,
    listContainer
} = styles;

function Someday ({specialSomedayID}) {
    const unsectionsByProject = useDataStore((state) => state.unsectionsByProject);
    const somedayProject = useDataStore(state => state.specialProjectsBySpecialId[specialSomedayID])
    const tasks = useDataStore((state) => state.tasks);

    const somedayTasks = () => {
        return Object.values(tasks)
        .filter((task) =>
            (task.parent_id === unsectionsByProject[somedayProject.id].id))
        .sort((a, b) => a.order - b.order)
    }

    const tasksSomeday = somedayTasks()

    return (
        <div className={somedayView}>
            <div className={somedayContainer}>

            <span className={tittle}>Someday / Maybe</span>
            <div className={scrollableContainer}>

                <div className={listContainer}>
                    {tasksSomeday.map((elem) =>
                        <SomedayTask key={elem.id} taskId={elem.id}/>
                    )
                    }
                </div>

            </div>
            </div>
        </div>
    )
}

export {Someday}
