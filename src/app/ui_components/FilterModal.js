import React, { useState } from "react";
import { Filter, Folder } from 'lucide-react';
import { useDataStore } from "../../store/data_store";
import * as styles from './FilterModal.module.css';

const {
    filterModalContainer,
    filtersCount,
    filterList,
    filterListItem,
    iconFilter,
    iconContainer,
    contentContainer,
    item,
    filterButton,
    checkBox,
    listTittle
} = styles

function FilterModal({ addFilter, removeFilter, filters }) {
    const projects = useDataStore(state => state.projects)
    const arrProjectswithSpecial = Object.values(projects)
    const arrProjects = arrProjectswithSpecial.filter((elem) => elem.special_type_id == null)
    const [isOpenModal, setIsOpenModal] = useState(false)

    return (
        <div className={filterModalContainer}>

            <div className={filterButton}
            onClick={() => setIsOpenModal(!isOpenModal)}
            >

                {(filters.length > 0) &&
                    <div className={filtersCount}>{filters.length}</div>
                }

                <Filter
                    className={iconFilter}
                />

                <span>Filter</span>


            </div>

            {isOpenModal &&
                <div
                    className={filterList}
                >
                    <span className={listTittle}>Folders</span>
                    {
                        arrProjects.map((project) => (
                            <ProjectCheck
                                key={project.id}
                                project={project}
                                addFilter={addFilter}
                                removeFilter={removeFilter}
                                filters={filters}
                            />
                        ))
                    }
                </div>
            }
        </div>
    )
}

function ProjectCheck({ project, addFilter, removeFilter, filters }) {
    const projectIdsFiltered = filters.map(elem => elem.projectId)
    const unsectionsByProject = useDataStore(state => state.unsectionsByProject)
    const [isChecked, setIsChecked] = useState(projectIdsFiltered.includes(project.id))

    const handleChange = (e) => {
        setIsChecked(e.target.checked);

        if (e.target.checked) {
            addFilter(unsectionsByProject[project.id].id, project.id)
        } else if (!e.target.checked) {
            removeFilter(project.id)
        }
    };

    return (
        <div className={filterListItem}>

            <input
                className={checkBox}
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
            >
            </input>

            <div className={item}>
                <div className={iconContainer}>
                    <Folder
                    color={`rgb(${project.myColor.color})`}
                    fill={`rgb(${project.myColor.color})`}
                    />
                </div>

                <div className={contentContainer}>
                    <span>{project.item_name}</span>
                </div>
            </div>

        </div>
    )
}

export { FilterModal }
