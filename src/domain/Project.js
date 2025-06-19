import { getUUID } from "../utils/generateUUID"

class Project {
    constructor(data) {
        this.id = data.id ?? getUUID()
        this.item_name = data.item_name?.trim() ?? ''
        this.description = data.description?.trim() ?? ''
        this.parent_id = null
        this.order = Number.isInteger(data.order) ? data.order : 0
        this.type_id = 3
        this.is_favorite = !!data.is_favorite
        this.status = data.status ?? 'pending'
        this.special_type_id = data.special_type_id ?? null
        this.color_id = typeof data.color_id === 'number' ? data.color_id : 1
        this.myColor = data.myColor ?? { id: 1, color: '0,0,0' }
        this.created_at = this.formatDate(data.created_at) ?? new Date().toISOString()
        this.updated_at = new Date().toISOString()

        this.validate()
    }

    static createProject(data) {
        return new Project(data)
    }

    validate() {
        if (typeof this.item_name !== 'string' || this.item_name.trim().length === 0) {
            throw new Error('El nombre del proyecto no puede estar vacío')
        }
        if (this.item_name.length < 3 || this.item_name.length > 100) {
            throw new Error('El nombre del proyecto debe tener entre 3 y 100 caracteres')
        }

        const estadosValidos = ['pending', 'active', 'archived']
        if (!estadosValidos.includes(this.status)) {
            throw new Error(`Estado inválido: ${this.status}. Debe ser uno de ${estadosValidos.join(', ')}`)
        }

        if (typeof this.color_id !== 'number' || this.color_id < 1 || this.color_id > 20) {
            throw new Error('El color_id debe ser un número entre 1 y 20')
        }

        if (
            typeof this.myColor !== 'object' ||
            typeof this.myColor.id !== 'number' ||
            typeof this.myColor.color !== 'string'
        ) {
            throw new Error('myColor debe tener una estructura válida (ej: { id: 1, color: "0,0,0" })')
        }
    }

    update(data) {
        if (data.item_name) this.item_name = data.item_name.trim()
        if (data.description !== undefined) this.description = data.description.trim()
        if (data.order !== undefined && Number.isInteger(data.order)) this.order = data.order
        if (data.is_favorite !== undefined) this.is_favorite = !!data.is_favorite
        if (data.status) this.status = data.status
        if (data.special_type_id !== undefined) this.special_type_id = data.special_type_id
        if (typeof data.color_id === 'number') this.color_id = data.color_id
        if (data.myColor) this.myColor = data.myColor
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

export { Project }
