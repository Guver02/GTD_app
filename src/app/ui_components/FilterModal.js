import React, { useState } from "react";
import { Filter, Folder } from "react-feather";
import { useDataStore } from "../../store/data_store";
import * as styles from './FilterModal.module.css';

const {
    filterModalContainer,
    filtersCount,
    filterList,
    filterListItem,
    iconFilter
} = styles

function FilterModal ({addFilter, removeFilter, filters}) {
    const projects = useDataStore(state => state.projects)
    const arrProjects = Object.values(projects)
    const [isOpenModal, setIsOpenModal] = useState(false)

    return(
        <div className={filterModalContainer}>

            <div
            >
                {(filters.length > 0) &&
                    <div className={filtersCount}>{filters.length}</div>
                }
                <Filter
                className={iconFilter}
                onClick={() => setIsOpenModal(!isOpenModal)}
                onMouseEnter={() => setIsOpenModal(true)}

                />
            </div>

            {isOpenModal&&
                <div
                className={filterList}
                onMouseLeave={() => setIsOpenModal(false)}
                >
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

function ProjectCheck ({project, addFilter, removeFilter, filters}) {
    const projectIdsFiltered = filters.map(elem => elem.projectId)
    const unsectionsByProject = useDataStore(state => state.unsectionsByProject)
    const [isChecked, setIsChecked] = useState(projectIdsFiltered.includes(project.id))

    const handleChange = (e) => {
        setIsChecked(e.target.checked);

        if(e.target.checked){
            addFilter(unsectionsByProject[project.id].id, project.id)
        }else if (!e.target.checked){
            removeFilter(project.id)
        }
    };

    return(
        <div className={filterListItem}>
            <div>
                <Folder style={{color: `rgb(${project.myColor.color})`}}/>
                <span>{project.item_name}</span>
            </div>
            <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            >
            </input>
        </div>
    )
}

export {FilterModal}
