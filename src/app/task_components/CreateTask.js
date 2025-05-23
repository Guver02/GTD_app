import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../providers/ModalContext";
import { useTaskService } from "../../services/taskService";
import * as styles from "./ViewTask.module.css"
import { ProjectsModal } from "../projects_components/ProjectsModal";
import { useDataStore } from "../../store/data_store";

const {
    container,
    formHeader,
    formEdit,
    tittle,
    formDescription,
    confirmButton,
    cancelButton,
    buttonText
} = styles

function CreateTask ({projectId, sectionId}) {
    const inbox = useDataStore((state) => state.inbox);
    const unsections = useDataStore((state) => state.unsectionsByProject);

    const {createTask} = useTaskService()
    const { closeModal } = useContext(ModalContext)
    const prevState = {
        projectId: projectId || inbox.id,
        sectionId: sectionId || unsections[inbox.id].id,
        itemName: '',
        description: ''
    }

    const [state, setState] = useState(prevState);

    const handleCreate = () => {
        createTask({
            item_name: state.itemName,
            description: state.description,
            parent_id: state.sectionId
        })
        setState({
            ...state,
            itemName: '',
            description: '',
        })
    }

    const changeFolderSection = (projectId, sectionId) => {
        setState((prevState) => ({
            ...prevState,
            projectId: projectId,
            sectionId: sectionId
        }))
    }

    return(<div className={container}>

        <div className={formHeader}>
            <button
            className={cancelButton}
            onClick={closeModal}
            >
                <span className={buttonText}>Cancelar</span>
            </button>
            <button
            className={confirmButton}
            onClick={handleCreate}>
                <span className={buttonText}>Guardar</span>
            </button>
        </div>

        <div className={formEdit}>

            <ProjectsModal
            values={{
                projectId: state.projectId,
                sectionId: state.sectionId}}
            functions={{changeFolderSection}}
            />

            <input
            className={tittle}
            id="inputFocus"
            placeholder="Contenido"
            autoComplete="off"
            value={state.itemName}
            onChange={(e) => setState((state) => ({...state, itemName: e.target.value}))}
            />
            <input
            className={formDescription}
            placeholder="Detalles"
            autoComplete="off"
            value={state.description}
            onChange={(e) => setState((state) => ({...state, description: e.target.value}))}
            />
        </div>

    </div>)
}

export {CreateTask}
