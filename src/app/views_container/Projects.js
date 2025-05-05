import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataStore } from "../../store/data_store";
import { shallow } from "zustand/shallow";
import { SectionList } from "../section_components/SectionList";
import { Section } from "../section_components/Section";
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import { Task } from "../task_components/Task";
import { useTaskService } from "../../services/taskService";
import * as styles from './Projects.module.css'
import { Edit, Trash2 } from "react-feather";
import { ModalContext } from "../providers/ModalContext";
import { DeleteConfirmation } from "../ui_components/DeleteConfirmation";
import { useProjectService } from "../../services/projectService";

const {
    projectsContainer,
    projectTittle,
    iconsContainer
} = styles

function Projects () {
    const {id} = useParams()
    const [activeItemId, setActiveItemId] = useState(null)
    const [firstActiveContainerId, setFirstContainerId] = useState('')
    const [isChange, setIschange] = useState(false)
    const allSections = useDataStore(state => state.sections, shallow)
    const project = useDataStore(state => state.projects[id])
    const tasks = useDataStore(state => state.tasks, shallow)
    const changeSection = useDataStore((state) => state.changeSection);
    const {openModal, closeModal} = useContext(ModalContext)
    const {deleteProject, updateProject} = useProjectService()
    const [editMode, setEditMode] = useState(false)
    const [input, setInput] = useState(project.item_name)
    const navigate = useNavigate();

    useEffect(() => {
        if(!project) navigate('/app')
    }, [])

    console.log(allSections)

    const {swapTaskOrder, swapParentAndOrder} = useTaskService()

    const sectionIDS = useMemo( () => {
        return Object.values(allSections)
        .filter((section) => section.parent_id == id)
        .sort((a, b) => a.order - b.order)
        .map(section => section.id)
    })

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const ondragstart = (event) => {
        const {active} = event
        setActiveItemId(active.id)
        //setIschange(false)
        setFirstContainerId(active.data.current.sortable.containerId)
        console.log("se ejecuta ondragstart de dnd kit")
    }



    const onDragOver = (event) => {
        const {active, over} = event

        if(active.data.current.sortable.containerId != over.data.current.sortable.containerId){
            changeSection(active.id,
                over.data.current.sortable.containerId,
                active.data.current.sortable.containerId
            )
            //setIschange(true)

        }
    }

    const onDragEnd = (event) => {
        const {active, over} = event
        console.log(firstActiveContainerId)

        if(
            (active.data.current.sortable.containerId == over.data.current.sortable.containerId)
            && (firstActiveContainerId == over.data.current.sortable.containerId)){
                console.log("reordenar")
            swapTaskOrder(active.id, over.id, active.data.current.sortable.containerId);
        }else if((active.data.current.sortable.containerId == over.data.current.sortable.containerId)
            && (firstActiveContainerId != over.data.current.sortable.containerId)){
                console.log("cambiar")
            swapParentAndOrder(active.id, over.id, active.data.current.sortable.containerId);
        }
    }

    const openConfirmModal = () =>{
        openModal(
        <DeleteConfirmation
        itemName={project.item_name}
        onCancel={closeModal}
        onConfirm={confirmDelete}
        />
        )
    }

    const confirmDelete = () => {
        navigate('/app/')
        deleteProject(id)
        closeModal()
    }

    const handleUpdateProject = () => {
        updateProject({
            id: id,
            item_name: input,
            parent_id: project.parent_id,
            order: project.order
        })
        setEditMode(false)
    }

    if(!project) return null

    return (
    <div
    className={projectsContainer}>

        <div className={projectTittle}>
            {!editMode ?
                <span
                onClick={() =>setEditMode(true)}
                >{project.item_name}</span>
                :
                <div>
                    <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    />
                    <Edit
                    onClick={handleUpdateProject}
                    />
                </div>
            }


            <div
            className={iconsContainer}>
                <Trash2
                onClick={openConfirmModal}/>
            </div>
        </div>

        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={ondragstart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}

        >
            <SectionList
            sectionIds={sectionIDS}
            SectionComponent={Section}
            projectId={id}
            />
            <DragOverlay>
                {activeItemId &&
                    <Task taskId={activeItemId}/>
                }
            </DragOverlay>
        </DndContext>
    </div>)
}

export {Projects}
