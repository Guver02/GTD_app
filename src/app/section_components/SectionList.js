import React, { useMemo, useState } from 'react';
import * as style from './SectionList.module.css'
import { Plus } from 'lucide-react';
import { useSectionService } from '../../controllers/sectionController';

const {
    sectionListContainer,
    createButton,
    scrollContainer,
    text,
    createContainer,
    redIcon
} = style

function SectionList({ sectionIds, SectionComponent, projectId }) {
    const { createSection } = useSectionService()
    const [input, setInput] = useState('')

    const handleCreateSection = () => {
        createSection({
            parent_id: projectId,
            item_name: input
        })
        setInput('')
    }

    return (
        <div className={scrollContainer}>
            <div
                className={sectionListContainer}
            >
                {sectionIds.map((id) => (
                    <SectionComponent key={id} sectionID={id} />
                ))}

                <div className={createContainer}>
                    <div className={createButton}>

                        <Plus
                            className={redIcon}
                            onClick={handleCreateSection}
                        />
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleCreateSection()
                        }}>
                            <input
                                className={text}
                                placeholder='Añadir Secccion'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                enterKeyHint="done"
                                inputMode="text"/>
                        </form>


                    </div>
                </div>
            </div>
        </div>
    );
}

export { SectionList }
