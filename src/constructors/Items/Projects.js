import { Item } from "./Items";

class Project extends Item {
    constructor(props) {
      super(props);
    }

    static getProject(data) {

        const prepared = this.prepareData(super.prepareData(data))

        this.validateData(prepared);
        return new Project(prepared);
    }

    static prepareData(data) {
        if (typeof data.type_id !== 3) {
            data.type_id = 3
        }
        data.parent_id = null
        return data
    }

    getProperties() {
        return ({

        })
    }

    getProjectFormatAPI() {
        return ({
            id: this.id,
            item_name: this.item_name,
            description: this.description,
            parent_id: this.parent_id,
            type_id: this.type_id,
            is_favorite: this.is_favorite,
            color_id: this.color_id
        })
    }

    getUpdateContentFormatAPI () {
        return({
            item_name: this.item_name,
            description: this.description,
            is_favorite: this.is_favorite,
        })
    }
  }


export {Project}
