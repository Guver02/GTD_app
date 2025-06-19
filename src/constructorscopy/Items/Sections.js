import {Item} from './Items'

class Section extends Item {
    constructor(props) {
        super(props);
    }

    static getSection(data) {

        const prepared = this.prepareData(super.prepareData(data))

        this.validateData(prepared);
        return new Section(prepared);
    }

    static prepareData(data) {
        if (typeof data.type_id !== 2) {
            data.type_id = 2
        }
        if(data.parent_id == null){
            throw new Error('El paret_id es necesario')
        }
        return data
    }

    static getUnsectioned(data) {

        const prepared = this.prepareUnsectionData(super.prepareData(data))

        this.validateData(prepared);
        return new Section(prepared);
    }

    static prepareUnsectionData(data) {
        if (typeof data.type_id !== 2) {
            data.type_id = 2
        }
        if (typeof data.special_type_id !== 2) {//unsectioned special-id
            data.special_type_id = 2
        }
        if(data.item_name !== 'UNSECTIONED'){
            data.item_name = 'UNSECTIONED'
        }

        if(data.parent_id == false || data.parent_id == null){
            throw new Error('EL parentID es necesario')
        }

        return data
    }

    getSectionFormatAPI () {
        return ({
            id: this.id,
            item_name: this.item_name,
            description: this.description,
            parent_id: this.parent_id,
            type_id: this.type_id,
            is_favorite: this.is_favorite,
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

export {Section}
