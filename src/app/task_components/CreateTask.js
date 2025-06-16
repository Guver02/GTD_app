import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../providers/ModalContext";
import { useTaskService } from "../../services/taskService";
import * as styles from "./CreateTask.module.css"
import { ProjectsModal } from "../projects_components/ProjectsModal";
import { useDataStore } from "../../store/data_store";

const {
    container,
    formFooter,
    formEdit,
    tittle,
    formDescription,
    confirmButton,
    cancelButton,
    buttonText,
    colorSelectorContainer,
    colorCircle,
    selectedColorCircle,
    rightFooter,
    topTittle
} = styles

function CreateTask({ projectId, sectionId }) {
    const inbox = useDataStore((state) => state.inbox);
    const unsections = useDataStore((state) => state.unsectionsByProject);
    const availableColors = useDataStore((state) => state.colors);
    const [selectedColor, setSelectedColor] = useState(availableColors[0]);
    const { createTask } = useTaskService()
    const { closeModal } = useContext(ModalContext)


    console.log('colors',availableColors)
    const prevState = {
        projectId: projectId || inbox.id,
        sectionId: sectionId || unsections[inbox.id].id,
        itemName: '',
        description: ''
    }

    const [state, setState] = useState(prevState);

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleCreate = () => {
        createTask({
            item_name: state.itemName,
            description: state.description,
            parent_id: state.sectionId,
            color_id: selectedColor.id,
            myColor: selectedColor,
        })
        setState({
            ...state,
            itemName: '',
            description: '',
        })
        setSelectedColor(availableColors[0])
    }

    const changeFolderSection = (projectId, sectionId) => {
        setState((prevState) => ({
            ...prevState,
            projectId: projectId,
            sectionId: sectionId
        }))
    }

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {

            handleCreate()
        }
    }

    return (<div
        className={container}
        onKeyDown={handleEnterKey}
    >

        <h2 className={topTittle}>Crear Nueva Tarea</h2>

        <div className={formEdit}>

            <ProjectsModal
                values={{
                    projectId: state.projectId,
                    sectionId: state.sectionId
                }}
                functions={{ changeFolderSection }}
            />

            <input
                className={tittle}
                id="inputFocus"
                placeholder="Contenido"
                autoComplete="off"
                value={state.itemName}
                onChange={(e) => setState((state) => ({ ...state, itemName: e.target.value }))}
            />
            <input
                className={formDescription}
                placeholder="Detalles"
                autoComplete="off"
                value={state.description}
                onChange={(e) => setState((state) => ({ ...state, description: e.target.value }))}
            />

            <div className={colorSelectorContainer}>
                <label>Color:</label>
                <div>
                    {availableColors &&
                        availableColors.map((elem) => (
                            <button
                                key={elem.color}
                                type="button"
                                className={`${colorCircle} ${selectedColor.id === elem.id ? selectedColorCircle : ''
                                    }`}
                                style={{ backgroundColor: `rgba(${elem.color},0.5)` }}
                                onClick={() => handleColorSelect(elem)}
                            ></button>
                        ))}
                </div>
            </div>
        </div>

        <div className={formFooter}>
            <div>
            </div>
            <div
            className={rightFooter}
            >
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
        </div>

    </div>)
}

export { CreateTask }
