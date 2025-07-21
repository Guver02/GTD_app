import React, { useContext, useMemo, useState } from "react";
import { useDataStore } from "../../store/data_store";
import { TaskList } from "../task_components/TaskList";
import { Task } from "../task_components/Task";
import * as style from './Section.module.css'
import { CreateTask } from "../task_components/CreateTask";
import { ModalContext } from "../providers/ModalContext";
import { MoreHorizontal, Plus } from 'lucide-react';
import { HoverModal } from "../ui_components/HoverModal";
import { SectionOptions } from "./SectionOptions";
import { useSectionService } from "../../controllers/sectionController";
import { useLanguage } from "../custom_hooks/useLanguage";

const {sectionContainer,
    sectionTittleContainer,
    sectionTittle,
    createInSection,
    iconTittle,
    sectionEditMode,
    editModeInput,
    confirmButton,
    cancelButton,
    editModeButtons,
    iconMore,
    redIcon
} = style

const Section = React.memo(({sectionID}) => {
    const {openModal} = useContext(ModalContext)
    const section = useDataStore((state) => state.sections[sectionID]);
    const unsectionsByProject = useDataStore(state => state.unsectionsByProject)

    const tasks = useDataStore((state) => state.tasks);
    const {translation} = useLanguage()
    const [showEditMode, setShowEditMode] = useState(false)
    const [input, setInput] = useState(section.item_name)

    const {updateSection} = useSectionService()

    const taskIDS = useMemo(() => {
        return Object.values(tasks)
        .filter((task) => task.parent_id == sectionID)
        .sort((a, b) => a.order - b.order)
        .map((task) => task.id)
    })

    if (!section) return null;

    const openCreateForm = () => {
        openModal(<CreateTask projectId={section.parent_id} sectionId={sectionID}/>)
    }

    const handleEditSection = () => {
        updateSection({
            id: section.id,
            item_name: input,
            order: section.order,
            parent_id: section.parent_id
        })
        setShowEditMode(false)
    }

    return(
        <div className={sectionContainer}>



            {(sectionID !== unsectionsByProject[section.parent_id].id)?
                <>
                {  (showEditMode == true) ?
                    <div className={sectionEditMode}>
                        <input
                        className={editModeInput}
                        placeholder={translation.nameSection}
                        value={input}
                        onChange={(e) => {setInput(e.target.value)}}
                        />

                        <div className={editModeButtons}>
                            <button
                            className={cancelButton}
                            onClick={() => setShowEditMode(false)}
                            >{translation.cancel}</button>
                            <button
                            className={confirmButton}
                            onClick={handleEditSection}
                            >{translation.save}</button>
                        </div>

                    </div>
                    :
                <div className={sectionTittleContainer}>

                    <span className={sectionTittle}>{`${section.item_name} ${section.order}`}</span>

                    <div className={iconMore}>
                        <HoverModal
                        ParentComponent={
                            <div className={iconTittle}>
                            <MoreHorizontal/>
                            </div>}
                        bubbleComponent={(closeModal) => (
                        <SectionOptions
                        id={sectionID}
                        closeOptions={closeModal}
                        editMode={setShowEditMode}
                        />)}
                        position='bottom'
                        alignment="end"
                        gap={4}/>
                    </div>

                </div>
                }
                </>
                :
                <div></div>
            }


            <TaskList taskIds={taskIDS} TaskComponent={Task} parentId={sectionID}/>

            <div
            className={createInSection}
            onClick={openCreateForm}
            >
                <Plus className={redIcon}/>
                <span>{translation.addTask}</span>
            </div>
        </div>
    )
});

export {Section}
