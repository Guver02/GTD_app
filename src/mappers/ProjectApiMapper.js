import { Project } from "../constructors/Items/Projects";

const ProjectApiMapper = {
  toApiFormat(project) {
    if (!(project instanceof Project )) {
      throw new Error('El objeto proporcionado no es una instancia de Project');
    }

    return {
      id: project.id,
      item_name: project.item_name,
      description: project.description,
      parent_id: project.parent_id,
      type_id: project.type_id,
      is_favorite: project.is_favorite,
      color_id: project.color_id
    };
  },

  toApiUpdateContentFormat(project) {
    if (!(project instanceof Project)) {
      throw new Error('El objeto proporcionado no es una instancia de Project');
    }

    return {
      item_name: project.item_name,
      description: project.description,
      is_favorite: project.is_favorite
    };
  }
};

export { ProjectApiMapper };
