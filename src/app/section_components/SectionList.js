import React, { useMemo, useState } from 'react';
import * as style from './SectionList.module.css'
import { SortableContext } from '@dnd-kit/sortable';
import { useDataStore } from '../../store/data_store';
import { Plus } from 'react-feather';
import { useSectionService } from '../../services/sectionService';

const {
    sectionListContainer,
    createButton,
    projectTittle,
    text,
    listContainer
} = style

function SectionList({ sectionIds, SectionComponent, projectId }) {
    const projectParent = useDataStore((state) => state.projects[projectId]);
    const {createSection} = useSectionService()
    const [input, setInput] = useState('')

    const handleCreateSection = () => {
        createSection({
            parent_id: projectId,
            item_name: input
        })
    }

  return (
    <div
    className={sectionListContainer}
    >



            {sectionIds.map((id) => (
            <SectionComponent key={id} sectionID={id} />
            ))}

            <div
            className={createButton}
            >
                <input
                className={text}
                placeholder='Añadir Secccion'
                value={input}
                onChange={(e)=>setInput(e.target.value)}></input>

                <Plus
                onClick={handleCreateSection}
                />
            </div>



    </div>
  );
}

export {SectionList}
