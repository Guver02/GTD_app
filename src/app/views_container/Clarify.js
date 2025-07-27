import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import * as styles from './Clarify.module.css'
import { Aperture, Battery, Calendar, Check, Clock, Save, Tag, Trash, UserMinus } from 'lucide-react';
import { useDataStore } from "../../store/data_store";
import { useTaskService } from "../../controllers/taskController";
import { ProjectsModal } from "../projects_components/ProjectsModal";
import { useRenderLogger } from "../utils_component/useRenderLogger";
import { CircularStepProgress } from "../utils_component/CircularStepProgress";
import { ModalContext } from "../providers/ModalContext";
import { AllClarifyed } from "../utils_component/AllClarifyed";
import { useLanguage } from "../custom_hooks/useLanguage";

const {
    clarifyContainer,
    progressContainer,
    actData,
    formStyles,
    sectionStyle,
    inputTittle,
    inputDescription,
    selectContainer,
    labelStyle,
    cancelButton,
    headerContainer,
    horizontal,
    optionButton
} = styles

const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
};

function ClarifyModal({ taskID, onComplete, stepNumber = 1, totalSteps = 1 }) {
    useRenderLogger()
    const { translation } = useLanguage();
    const task = useDataStore(state => state.tasks[taskID])
    const sections = useDataStore(state => state.sections)
    const specialProjectsBySpecialId = useDataStore(state => state.specialProjectsBySpecialId)
    const unsectionsByProject = useDataStore(state => state.unsectionsByProject)
    const project = useDataStore(state => state.projects[sections[task.parent_id].parent_id])
    const { closeModal } = useContext(ModalContext)

    const { updateTask, deleteTask, setNextActionState } = useTaskService()

    const prevState = useMemo(() => {
        return ({
            projectId: sections[task.parent_id].parent_id,
            sectionId: task.parent_id,
            item_name: task.item_name,
            description: task.description,
            order: task.order,
            color_id: task.color_id,
            myColor: {
                id: task.myColor.id,
                color: task.myColor.color,
            }
        })
    }, [taskID])

    const [state, setState] = useState(prevState)

    useEffect(() => {
        setState(prevState)
    }, [prevState])

    const changeFolderSection = (projectId, sectionId) => {
        setState((prev) => ({
            ...prev,
            projectId: projectId,
            sectionId: sectionId
        }))
    }

    const handleMe = () => {

        updateTask({
            id: task.id,
            parent_id: state.sectionId,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: state.state,
            color_id: state.color_id,
            myColor: {
                id: state.myColor.id,
                color: state.myColor.color,
            },
            is_next: true
        }, prevState)



        console.log('handleMe ejecutado')

        onComplete()
    }

    const handleDone = () => {
        updateTask({
            id: task.id,
            parent_id: prevState.sectionId,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'completed',
            color_id: state.color_id,
            myColor: {
                id: state.myColor.id,
                color: state.myColor.color,
            },
            is_next: true
        }, prevState)

        onComplete()
    }

    const handleSomeday = () => {
        updateTask({
            id: task.id,
            parent_id: unsectionsByProject[specialProjectsBySpecialId[specialTypesIDS.someday].id].id,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'pending',
            color_id: state.color_id,
            myColor: {
                id: state.myColor.id,
                color: state.myColor.color,
            },
            is_next: false
        }, prevState)

        onComplete()
    }

    const handleReference = () => {
        updateTask({
            id: task.id,
            parent_id: unsectionsByProject[specialProjectsBySpecialId[specialTypesIDS.referenceFile].id].id,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'pending',
            color_id: state.color_id,
            myColor: {
                id: state.myColor.id,
                color: state.myColor.color,
            },
            is_next: false
        }, prevState)

        onComplete()
    }

    const handleDelete = () => {
        deleteTask(task.id)

        onComplete()
    }

    const handleOther = () => {
        updateTask({
            id: task.id,
            parent_id: unsectionsByProject[specialProjectsBySpecialId[specialTypesIDS.waiting].id].id,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'pending',
            color_id: state.color_id,
            myColor: {
                id: state.myColor.id,
                color: state.myColor.color,
            },
            is_next: false
        }, prevState)
        //Se necesita un delegador a x usuario o algo editable
        onComplete()
    }

    const handleLater = () => {
        updateTask({
            id: task.id,
            parent_id: unsectionsByProject[specialProjectsBySpecialId[specialTypesIDS.trackingFile].id].id,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'pending'
        }, prevState)
        //Se necesita un activador
        onComplete()
    }



    const handleCancel = () => {
        closeModal()
    }

    return (
        <div className={clarifyContainer}>

            <div className={headerContainer}>

                <div className={progressContainer}>
                    <CircularStepProgress stepNumber={stepNumber} totalSteps={totalSteps} />

                    <div className={actData}>
                        {stepNumber != null && totalSteps != null && (
                            <span>{`${translation.clarifyStep} ${stepNumber} ${translation.of} ${totalSteps}`}</span>
                        )}
                        <span>{project.item_name}</span>
                    </div>
                </div>

                <div>
                    <button
                        className={cancelButton}
                        onClick={handleCancel}
                    >
                        {translation.cancel}
                    </button>
                </div>

            </div>


            <div className={formStyles}>
                <span className={sectionStyle}>{translation.whatIsThis}</span>
                <input
                    className={inputTittle}
                    value={state.item_name}
                    onChange={(e) => setState((prev) => ({ ...prev, item_name: e.target.value }))}
                />
                <input
                    className={inputDescription}
                    value={state.description}
                    onChange={(e) => setState((prev) => ({ ...prev, description: e.target.value }))}
                />

                <span className={sectionStyle}>{translation.needMultipleActions}</span>

                <div className={selectContainer}>
                    <span className={labelStyle}>{translation.project}</span>
                    <ProjectsModal
                        values={{
                            projectId: state.projectId,
                            sectionId: state.sectionId
                        }}
                        functions={{ changeFolderSection }}
                    />
                </div>



                <span className={sectionStyle}>{translation.isItActionable}</span>

                <div className={horizontal}>
                    <span>{translation.yes}</span>
                    <div
                        className={optionButton}
                        onClick={handleMe}
                    >
                        <span>{translation.willDo}</span>
                        <Aperture />
                    </div>
                    <div
                        className={optionButton}
                        onClick={handleOther}
                    >
                        <span>{translation.delegate}</span>
                        <UserMinus />
                    </div>
                    <div
                        className={optionButton}
                        onClick={handleDone}
                    >
                        <span>{translation.doneInMinutes}</span>
                        <Check />
                    </div>
                </div>

                <div className={horizontal}>
                    <span>{translation.no}</span>
                    <div
                        className={optionButton}
                        onClick={handleSomeday}
                    >
                        <span>{translation.doLater}</span>
                        <Clock />
                    </div>

                    <div
                        className={optionButton}
                        onClick={handleReference}
                    >
                        <span>{translation.referenceInfo}</span>
                        <Save />
                    </div>
                    <div
                        className={optionButton}
                        onClick={handleDelete}
                    >
                        <span>{translation.notUseful}</span>
                        <Trash />
                    </div>
                </div>
            </div>



        </div>
    )
}

function Clarify({ sectionToClarifyID }) {
    const project = useDataStore((state) => state.specialProjectsBySpecialId[specialTypesIDS.inbox])

    const unsectionedInbox = useDataStore(state => state.unsectionsByProject[project.id])

    const sectionID = sectionToClarifyID ? sectionToClarifyID : unsectionedInbox.id

    useRenderLogger()
    const tasksRef = useRef(useDataStore.getState().tasks)
    const tasksList = Object.values(tasksRef.current).filter(
        task => task.parent_id === sectionID &&
            task.status !== "completed" &&
            task.is_next === false
    );

    const [currentIndex, setCurrentIndex] = useState(0);


    const currentTask = tasksList[currentIndex];

    const handleComplete = () => {
        setCurrentIndex(prev => prev + 1)
    }

    if (!currentTask) return <AllClarifyed />
    if (currentIndex >= tasksList.length) return <AllClarifyed />

    return (
        <ClarifyModal
            taskID={currentTask.id}
            onComplete={handleComplete}
            stepNumber={currentIndex + 1}
            totalSteps={tasksList.length}
        />
    );
}

export { Clarify, ClarifyModal }
