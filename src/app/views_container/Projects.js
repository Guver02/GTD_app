import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDataStore } from "../../store/data_store";
import { shallow } from "zustand/shallow";
import { SectionList } from "../section_components/SectionList";
import { Section } from "../section_components/Section";
import { DndContext, closestCorners, PointerSensor, useSensor, useSensors, closestCenter, DragOverlay } from "@dnd-kit/core";
import { Task } from "../task_components/Task";
import { useTaskService } from "../../controllers/taskService";
import * as styles from './Projects.module.css'
import { Edit, Folder, MoreHorizontal, Trash2 } from "react-feather";
import { ModalContext } from "../providers/ModalContext";
import { DeleteConfirmation } from "../ui_components/DeleteConfirmation";
import { useProjectService } from "../../controllers/projectController";
import { HoverModal } from "../ui_components/HoverModal";
import { ProjectOptions } from "../projects_components/ProjectOptions";

const {
    projectsContainer,
    projectTittle,
    iconsContainer,
    projectsView,
    tittle,
    inputStyle,
    folderIcon
} = styles

function Projects () {
    const {id} = useParams()
    const [activeItemId, setActiveItemId] = useState(null)
    const [firstActiveContainerId, setFirstContainerId] = useState('')
    const allSections = useDataStore(state => state.sections, shallow)
    const project = useDataStore(state => state.projects[id])
    const changeSection = useDataStore((state) => state.changeSection);
    const {openModal, closeModal} = useContext(ModalContext)
    const {deleteProject, updateProject} = useProjectService()
    const [input, setInput] = useState('')
    const navigate = useNavigate();
    const inputRef = useRef(null);

    useEffect(() => {
        if(!project) navigate('/app')
    }, [])

    useEffect(() => {
        if (project) {
            setInput(project.item_name);
        }
    }, [project?.item_name]);


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

        if(
            (active.data.current.sortable.containerId == over.data.current.sortable.containerId)
            && (firstActiveContainerId == over.data.current.sortable.containerId)){
            swapTaskOrder(active.id, over.id, active.data.current.sortable.containerId);
        }else if((active.data.current.sortable.containerId == over.data.current.sortable.containerId)
            && (firstActiveContainerId != over.data.current.sortable.containerId)){
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
        navigate('/app/inbox')
        deleteProject(id)
        closeModal()
    }

    const checkEnter = (e) => {
        if (e.key === 'Enter' && input !== '') {
            handleUpdateProject()
        }
    }

    const handleUpdateProject = () => {
        updateProject({
            id: id,
            item_name: input,
            parent_id: project.parent_id,
            order: project.order,
            color_id: project.color_id,
            myColor: project.myColor
        })
        inputRef.current.blur()
    }



    if(!project) return null

    return (
    <div className={projectsView}>
        <div className={projectsContainer}>

        <div className={projectTittle}>

    <div
        className={folderIcon}
        style={{backgroundColor: `rgba(${project.myColor.color},0.7)`}}
    >
        <Folder/>
    </div>


        <form className={tittle}

            onSubmit={(e) => {
                e.preventDefault();
                if (input !== '') {
                    handleUpdateProject();
                }
            }}
        >
            <input
                ref={inputRef}
                className={inputStyle}
                placeholder="El nombre de tu proyecto"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                enterKeyHint="done"
                inputMode="text"
            />
        </form>


    <div>
        <HoverModal
            ParentComponent={
                <div className={iconsContainer}>
                    <MoreHorizontal/>
                </div>}
            bubbleComponent={(closeModal) => (
                <ProjectOptions
                    id={id}
                    closeOptions={closeModal}
                    deleteFunction={openConfirmModal}
                    editFunction={() => {}}
                />)}
            position='bottom'
            gap={4}
        />
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
        </div>
    </div>)
}

export {Projects}
