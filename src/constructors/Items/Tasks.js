import {Item} from './Items'

class Task extends Item {
    constructor(props) {
        super(props);
    }

    static getTask(data) {

        const prepared = this.prepareData(super.prepareData(data))

        this.validateData(prepared);
        return new Task(prepared);
    }

    static prepareData(data) {
        if (typeof data.type_id !== 1) {
            data.type_id = 1
        }
        if(data.parent_id == null){
            throw new Error('El paret_id es necesario')
        }
        return data
    }

    getTaskFormatAPI() {
        return ({
            id: this.id,
            item_name: this.item_name,
            description: this.description,
            parent_id: this.parent_id,
            type_id: this.type_id,
            is_favorite: this.is_favorite
        })
    }

    getUpdateTaskFormatAPI() {
        return ({
            item_name: this.item_name,
            description: this.description,
            is_favorite: this.is_favorite
        })
    }
}

export {Task}
