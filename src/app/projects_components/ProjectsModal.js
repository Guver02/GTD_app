import React, { useContext, useState } from "react";
//import { ItemsContext } from "../../providers/ItemsContext";
import * as style from './ProjectsModal.module.css'
import { useDataStore } from "../../store/data_store";
import { shallow } from "zustand/shallow";
import { ArrowDown, ChevronDown, ChevronsDown, CornerDownRight, Folder, Hash, Inbox, Plus } from 'lucide-react';
import { ModalContext } from "../providers/ModalContext";
//import { DataContext } from "../../providers/DataContext";
import { CreateProject } from '../projects_components/CreateProject'

const { sectionItem, itemInbox, folderDataItem, subModalContainer, button, positionContainer,
    iconContainer,
    contentContainer
 } = style

function ProjectsModal({ functions, values }) {
    const { changeFolderSection } = functions
    const { projectId, sectionId } = values

    const projects = useDataStore((state) => state.projects, shallow)
    const sections = useDataStore((state) => state.sections)

    const inbox = useDataStore((state) => state.inbox);
    const unsectionsByProject = useDataStore((state) => state.unsectionsByProject)
    const [isClosed, setIsClosed] = useState(true)

    const { openModal } = useContext(ModalContext)

    const handleCreate = () => {
        openModal(<CreateProject />)
    }

    const styleFolders = {
        color: `rgba(${projects[projectId].myColor?.color},1)`
    }

    return (
        <div className={positionContainer}>

            <div
                className={button}
                style={styleFolders}
                onClick={() => setIsClosed(!isClosed)}>

                <Folder />
                <span>{projects[projectId].item_name}</span>

                <span>{
                    (sections[sectionId]?.item_name) &&
                    (sections[sectionId].special_type_id == null)
                        ?
                        `/${sections[sectionId].item_name}`
                        :
                        ''}</span>
                <ChevronDown />
            </div>


            {!isClosed && <>
                <div className={subModalContainer}>

                    {
                        Object.values(projects).map((elem, i) => {

                            if (elem.id == inbox.id) {
                                return (
                                    <div
                                        key={`inbox${elem.id}`}

                                        className={itemInbox}
                                        onClick={() => {
                                            changeFolderSection(
                                                inbox.id,
                                                unsectionsByProject[inbox.id].id)
                                            setIsClosed(!isClosed)
                                        }}>
                                        <Inbox />
                                        <span>{elem.item_name}</span>
                                    </div>
                                )
                            } else {
                                if(!elem.special_type_id){
                                    return (<div key={`folder${elem.id}`}>

                                    <div


                                        className={folderDataItem}
                                        onClick={() => {
                                            changeFolderSection(
                                                elem.id,
                                                unsectionsByProject[elem.id].id)
                                            setIsClosed(!isClosed)
                                        }}>
                                        <div
                                        className={iconContainer}>
                                            <Folder
                                                style={{ color: `rgba(${elem.myColor.color},1)` }}
                                            />
                                        </div>
                                        <div
                                        className={contentContainer}>
                                            <span>{elem.item_name}</span>
                                        </div>
                                    </div>

                                    {
                                        Object.values(sections)
                                            .filter((section) =>
                                                ((section.parent_id == elem.id) &&
                                                (!section.special_type_id)))
                                            .sort((a, b) => a.order - b.order)
                                            .map((section) => {


                                                return (<div
                                                    key={`section${section.id}`}

                                                    className={sectionItem}
                                                    onClick={() => {
                                                        changeFolderSection(
                                                            elem.id,
                                                            section.id)
                                                        setIsClosed(!isClosed)
                                                    }}>
                                                    <CornerDownRight />
                                                    <span>{section.item_name}</span>
                                                </div>)

                                            })
                                    }

                                </div>
                                )
                                }
                            }


                        })
                    }

                    <div
                        className={folderDataItem}
                        onClick={handleCreate}
                    >
                        <Plus />
                        <span>Crear Proyecto</span>
                    </div>

                </div>
            </>}

        </div>
    );

}

export { ProjectsModal }
