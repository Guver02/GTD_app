import { Section } from "../constructors/Items/Sections";

const SectionApiMapper = {
    toApiFormat(section) {
        if (!(section instanceof Section)) {
            throw new Error('El objeto proporcionado no es una instancia de Section');
        }

        return {
            id: section.id,
            item_name: section.item_name,
            description: section.description,
            parent_id: section.parent_id,
            type_id: section.type_id,
            is_favorite: section.is_favorite,
        };
    },

    toApiUpdateFormat(section) {
        if (!(section instanceof Section)) {
            throw new Error('El objeto proporcionado no es una instancia de Section');
        }

        return {
            item_name: section.item_name,
            description: section.description,
            is_favorite: section.is_favorite,
        };
    }
};

export { SectionApiMapper };
