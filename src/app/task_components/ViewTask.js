import React, { useContext, useEffect, useState } from "react";
import { ModalContext } from "../providers/ModalContext";
import { useTaskService } from "../../controllers/taskService";
import * as styles from "./ViewTask.module.css"
import { ProjectsModal } from "../projects_components/ProjectsModal";
import { useDataStore } from "../../store/data_store";
import { Trash, Trash2 } from "react-feather";
import { ClarifyModal } from "../views_container/Clarify";

const typesForm = {
    create: 'create',
    update: 'update'
}
const {
    container,
    formHeader,
    formEdit,
    tittle,
    formDescription,
    confirmButton,
    cancelButton,
    buttonText,
    deleteButton,
    lefthHeader,
    rightHeader,
    rowFlex,
     colorSelectorContainer,
  colorCircle,
  selectedColorCircle,
} = styles

function ViewTask({
    id,
    itemName,
    description,
    parent_id,
    order,
    myColor
}){
    const {updateTask} = useTaskService()
    const section = useDataStore((state) => state.sections[parent_id])
    const {deleteTask} = useTaskService()
    const {openModal, closeModal} = useContext(ModalContext)

    const availableColors = useDataStore((state) => state.colors);

    const handleColorSelect = (color) => {
    setSelectedColor(color);
  };
    const prevState = {
        projectId: section.parent_id,
        sectionId: parent_id,
        item_name: itemName,
        description: description,
        order: order
    }

    const [state, setState] = useState(prevState);
    const [selectedColor, setSelectedColor] = useState(myColor);
    const update = () => {
        //Cambiar seccion y/o contenido

        updateTask({
            id: id,
            parent_id: state.sectionId,
            item_name: state.item_name,
            description: state.description,
            order: state.order,
            color_id: selectedColor.id,
            myColor: selectedColor,
        }, prevState);

        closeModal()
    }

    const changeFolderSection =  (projectId, sectionId) => {
        setState((prev) => ({
            ...prev,
            projectId: projectId,
            sectionId: sectionId
        }))
    }

    const handleDelete = () => {
        deleteTask(id)
        closeModal()
    }

    const handleClarify = () => {
        openModal(
        <ClarifyModal
        taskID={id}
        onComplete={closeModal}
        />)
    }

    return(<div className={container}>

        <div className={formHeader}>
            <div
            className={lefthHeader}
            onClick={handleDelete}
            >
                <div className={deleteButton}>
                    <Trash2/>
                </div>
            </div>

            <div className={rightHeader}>
                <button className={cancelButton}
                    onClick={closeModal}
                >
                    <span className={buttonText}>Cancelar</span>
                </button>
                <button className={confirmButton} onClick={() => update(id)}>
                    <span className={buttonText}>Guardar</span>
                </button>
            </div>
        </div>

        <div className={formEdit}>

            <div
            className={rowFlex}
            >
            <ProjectsModal
            values={{
            projectId: state.projectId,
            sectionId: state.sectionId}}
            functions={{changeFolderSection}}
            />

                <button
                className={confirmButton}
                onClick={handleClarify}
                >
                    <span className={buttonText}>
                        Aclarar
                    </span>
                </button>
            </div>

            <input
            className={tittle}
            id="inputFocus"
            placeholder="Contenido"
            value={state.item_name}
            onChange={(e) => setState((state) => ({...state, item_name: e.target.value}))}
            />
            <input
            className={formDescription}
            placeholder="Detalles"
            value={state.description}
            onChange={(e) => setState((state) => ({...state, description: e.target.value}))}
            />


        <div className={colorSelectorContainer}>
          <label>Color:</label>
          <div>
            {availableColors &&
              availableColors.map((elem) => (
                <button
                  key={elem.color}
                  type="button"
                  className={`${colorCircle} ${
                    selectedColor.id === elem.id ? selectedColorCircle : ''
                  }`}
                  style={{ backgroundColor:  `rgba(${elem.color},0.5)`}}
                  onClick={() => handleColorSelect(elem)}
                ></button>
              ))}
          </div>
        </div>

        </div>



    </div>)
}

export {ViewTask, typesForm}
