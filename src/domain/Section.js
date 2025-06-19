import { getUUID } from '../utils/generateUUID'

class Section {
    constructor(data) {
        this.id = data.id ?? getUUID()
        this.item_name = data.item_name?.trim() ?? 'UNSECTIONED'
        this.description = data.description?.trim() ?? ''
        this.parent_id = data.parent_id
        this.order = Number.isInteger(data.order) ? data.order : 0
        this.type_id = 2
        this.is_favorite = !!data.is_favorite
        this.status = data.status ?? 'pending'
        this.special_type_id = data.special_type_id ?? null
        this.created_at = this.formatDate(data.created_at) ?? new Date().toISOString()
        this.updated_at = new Date().toISOString()

        this.validate()
    }

    static createSection(data) {
        return new Section(data)
    }

    static createUnsectioned(parent_id) {
        return new Section({
            item_name: 'UNSECTIONED',
            parent_id: parent_id,
            special_type_id: 2,
            order: 0,
        })
    }

    validate() {
        if (!this.parent_id) {
            throw new Error('El "parent_id" de la sección es obligatorio')
        }

        if (typeof this.item_name !== 'string' || this.item_name.trim().length === 0) {
            throw new Error('El nombre de la sección no puede estar vacío')
        }

        if (this.item_name.length < 3 || this.item_name.length > 100) {
            throw new Error('El nombre de la sección debe tener entre 3 y 100 caracteres')
        }

        const estadosValidos = ['pending', 'active', 'archived']
        if (!estadosValidos.includes(this.status)) {
            throw new Error(`Estado inválido: ${this.status}`)
        }

        if (this.type_id !== 2) {
            throw new Error('La sección debe tener type_id = 2')
        }
    }

    update(data) {
        if (data.item_name) this.item_name = data.item_name.trim()
        if (data.description !== undefined) this.description = data.description.trim()
        if (data.order !== undefined && Number.isInteger(data.order)) this.order = data.order
        if (data.is_favorite !== undefined) this.is_favorite = !!data.is_favorite
        if (data.status) this.status = data.status
        if (data.special_type_id !== undefined) this.special_type_id = data.special_type_id

        this.updated_at = new Date().toISOString()
        this.validate()
    }

    formatDate(fecha) {
        try {
            return new Date(fecha).toISOString()
        } catch {
            return new Date().toISOString()
        }
    }
}

export { Section }
