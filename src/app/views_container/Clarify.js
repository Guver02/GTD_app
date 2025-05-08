import React, { useEffect, useMemo, useRef, useState } from "react";
import * as styles from './Clarify.module.css'
import { Aperture, Battery, Calendar, Check, Clock, Save, Tag, Trash, UserMinus } from "react-feather";
import { useDataStore } from "../../store/data_store";
import { HoverModal } from '../ui_components/HoverModal'
import { ProjectListModal } from "../projects_components/ProjectListModal";
import { useTaskService } from "../../services/taskService";
import { ProjectsModal } from "../projects_components/ProjectsModal";
import { useRenderLogger } from "../utils_component/useRenderLogger";
import { CircularStepProgress } from "../utils_component/CircularStepProgress";

const {
    clarifyContainer,
    progressContainer,
    circleProgress,

    actData,

    formStyles,
    sectionStyle,
    inputTittle,
    inputDescription,
    selectContainer,
    labelStyle,
    selectedStyle,

    electionContainer,
    electionItem,

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

function ClarifyModal ({taskID, onComplete, stepNumber, totalSteps}) {
    useRenderLogger()
    const task = useDataStore(state => state.tasks[taskID])
    const sections = useDataStore(state => state.sections)
    const specialProjectsBySpecialId = useDataStore(state => state.specialProjectsBySpecialId)
    const unsectionsByProject = useDataStore(state => state.unsectionsByProject)
    const project = useDataStore(state => state.projects[sections[task.parent_id].parent_id])

    const {updateTask, deleteTask} = useTaskService()

    const prevState = useMemo(() => {
        return ({
            projectId: sections[task.parent_id].parent_id,
            sectionId: task.parent_id,
            item_name: task.item_name,
            description: task.description,
            order: task.order
        })
    }, [taskID])

    const [state, setState] = useState(prevState)

    useEffect(() => {
        setState(prevState)
    }, [prevState])


    const handleMe = () => {
        updateTask({
            id: task.id,
            parent_id: state.sectionId,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'in_progress'
        }, prevState)

        onComplete()
    }

    const handleDone = () => {
        updateTask({
            id: task.id,
            parent_id: prevState.sectionId,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            status: 'completed'
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
            status: 'pending'
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
            status: 'pending'
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
            status: 'pending'
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

    const changeFolderSection =  (projectId, sectionId) => {
        setState((prev) => ({
            ...prev,
            projectId: projectId,
            sectionId: sectionId
        }))
    }

    return(
        <div className={clarifyContainer}>

            <div className={progressContainer}>

                <CircularStepProgress stepNumber={stepNumber} totalSteps={totalSteps}/>

                <div className={actData}>
                {stepNumber != null && totalSteps != null && (
                    <span>{`Paso ${stepNumber} de ${totalSteps}`}</span>
                )}
                    <span>{project.item_name}</span>
                </div>

            </div>

            {/*linea divisora bordertop*/}
            <div className={formStyles}>
                <span className={sectionStyle}>¿Qué es esto exactamente?</span>
                <input
                className={inputTittle}
                value={state.item_name}
                onChange={(e) => setState((prev) => ({...prev, item_name: e.target.value}))}
                />
                <input
                className={inputDescription}
                value={state.description}
                onChange={(e) => setState((prev) => ({...prev, description: e.target.value}))}
                />

                <span className={sectionStyle}>¿Necesitas mas de una accion para lograr el resultado?</span>

                <div className={selectContainer}>
                    <span className={labelStyle}>Proyecto</span>
                    <ProjectsModal
                     values={{
                        projectId: state.projectId,
                        sectionId: state.sectionId}}
                    functions={{changeFolderSection}}
                    />
                </div>



                <span className={sectionStyle}>¿Es Accionable?</span>

                <div className={horizontal}>
                    <span>Si</span>
                    <div
                    className={optionButton}
                    onClick={handleMe}
                    >
                        <span>Lo haré yo</span>
                        <Aperture/>
                    </div>
                    <div
                    className={optionButton}
                    onClick={handleOther}
                    >
                        <span>Lo hara otra persona</span>
                        <UserMinus/>
                    </div>
                    <div
                    className={optionButton}
                    onClick={handleDone}
                    >
                        <span>Hecho en 2 minutos</span>
                        <Check/>
                    </div>
                </div>

                <div className={horizontal}>
                    <span>No</span>
                    <div
                    className={optionButton}
                    onClick={handleSomeday}
                    >
                        <span>Lo aclaro despues</span>
                        <Clock/>
                    </div>
                    <div
                    className={optionButton}
                    onClick={handleLater}
                    >
                        <span>Lo necesito luego</span>
                        <Calendar/>
                    </div>
                    <div
                    className={optionButton}
                    onClick={handleReference}
                    >
                        <span>Es informacion util</span>
                        <Save/>
                    </div>
                    <div
                    className={optionButton}
                    onClick={handleDelete}
                    >
                        <span>No es nada</span>
                        <Trash/>
                    </div>
                </div>
            </div>



        </div>
    )
}

function Clarify({ sectionToClarifyID }) {
    useRenderLogger()
    const tasksRef = useRef(useDataStore.getState().tasks)
    const tasksList = Object.values(tasksRef.current).filter(
        task => task.parent_id === sectionToClarifyID && task.status === "pending"
      );

    const [currentIndex, setCurrentIndex] = useState(0);


    const currentTask = tasksList[currentIndex];

    const handleComplete = () => {
        setCurrentIndex(prev => prev + 1)
    }

    if(!currentTask) return <div>No hay tareas pendientes.</div>;
    if (currentIndex >= tasksList.length) return <div>¡Todo aclarado!</div>;

    return (
      <ClarifyModal
        taskID={currentTask.id}
        onComplete={handleComplete}
        stepNumber={currentIndex + 1}
        totalSteps={tasksList.length}
      />
    );
  }

export {Clarify, ClarifyModal}

/**
 * <div className={selectContainer}>
                    <span className={labelStyle}>Horizontes de Enfoque</span>
                    <select className={selectedStyle}></select>
                </div>
                <div className={selectContainer}>
                    <span className={labelStyle}>Objetivo</span>
                    <select className={selectedStyle}></select>
                </div>
 */

/*
 <span className={sectionStyle}>Criterios de Eleccion</span>
                <div className={electionContainer}>
                    <div className={electionItem}>
                    <Clock/>
                    <input type="date"/>
                    </div>

                    <div className={electionItem}>
                    <Battery/>
                    <label>Baja</label>
                    <input type="radio"/>
                    <label>alta</label>
                    <input type="radio"/>
                    </div>

                    <div className={electionItem}>
                    <Tag/>
                    <select>Etiquetas</select>
                    </div>

                </div>
 */
