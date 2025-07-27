import { getUUID } from '../utils/generateUUID'

class Task {
    constructor(data) {
        console.log('datata',data)

        this.id = data.id ?? getUUID()
        this.item_name = data.item_name?.trim() ?? ''
        this.description = data.description?.trim() ?? ''
        this.parent_id = data.parent_id
        this.order = Number.isInteger(data.order) ? data.order : 0
        this.type_id = 1
        this.is_favorite = !!data.is_favorite
        this.status = data.status ?? 'pending'
        this.color_id = typeof data.color_id === 'number' ? data.color_id : 1
        this.created_at = this.formatDate(data.created_at) ?? new Date().toISOString()
        this.myColor = data.myColor ?? { id: 1, color: '0,0,0' }
        this.updated_at = new Date().toISOString()
        this.is_next = data.is_next ?? false;

        this.validate()
    }

    static createTask(data) {
        return new Task(data)
    }

    validate() {
        if (!this.parent_id) {
            throw new Error('El "parent_id" de la tarea es obligatorio')
        }

        if (typeof this.item_name !== 'string' || this.item_name.trim().length === 0) {
            throw new Error('El nombre de la tarea no puede estar vacío')
        }

        if (this.item_name.length < 3 || this.item_name.length > 100) {
            throw new Error('El nombre de la tarea debe tener entre 3 y 100 caracteres')
        }

        const estadosValidos = ['pending','in_progress', 'completed']
        if (!estadosValidos.includes(this.status)) {
            throw new Error(`Estado inválido: ${this.status}. Debe ser uno de ${estadosValidos.join(', ')}`)
        }

        if (typeof this.color_id !== 'number' || this.color_id < 1 || this.color_id > 20) {
            throw new Error('El color_id debe ser un número entre 1 y 20')
        }

        if (this.type_id !== 1) {
            throw new Error('La tarea debe tener type_id = 1')
        }
    }

    update(data) {
        if (data.item_name) this.item_name = data.item_name.trim()
        if (data.description !== undefined) this.description = data.description.trim()
        if (data.order !== undefined && Number.isInteger(data.order)) this.order = data.order
        if (data.is_favorite !== undefined) this.is_favorite = !!data.is_favorite
        if (data.status) this.status = data.status
        if (typeof data.color_id === 'number') this.color_id = data.color_id

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

export { Task }
