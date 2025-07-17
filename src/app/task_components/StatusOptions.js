import React from "react";
import * as style from "./Statusptions.module.css";
import { useTaskService } from "../../controllers/taskController";
import { CircleCheck, CircleDashed, ClockFading, Edit, Sun, Trash2 } from 'lucide-react';

const {
    container,
    optionsList,
    statusContent
} = style;

function StatusOptions({id, onClose}) {
    const {changeStatus} = useTaskService()

    const setPendingStatus = () => {
        changeStatus(id, 'pending')
        onClose()
    }
    const setInProgressStatus = () => {
        changeStatus(id, 'in_progress')
        onClose()
    }
    const setCompletedStatus = () => {
        changeStatus(id, 'completed')
        onClose()
    }

    return (
        <div className={container}>
            <ul className={optionsList}>
                <li>
                    <div
                    className={statusContent}
                    onClick={setPendingStatus}>
                        <CircleDashed color={`rgba(139, 142, 147, 1)`} />
                        <span>Pending</span>
                    </div>
                </li>
                <li>
                    <div className={statusContent}
                        onClick={setInProgressStatus}>
                        <ClockFading color={`rgba(217, 117, 59, 1)`} />
                        <span>In Progress</span>
                    </div>
                </li>
                <li>
                    <div className={statusContent}
                        onClick={setCompletedStatus}>
                        <CircleCheck color={`rgba(3, 140, 76, 1)`} />
                        <span>Completed</span>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export { StatusOptions };
