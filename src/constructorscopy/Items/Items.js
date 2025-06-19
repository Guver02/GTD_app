import {getUUID} from '../../utils/generateUUID'
import { validate as validateUUID } from 'uuid';

class Item {
    constructor(data) {
        const prepared = Item.prepareData(data); // usamos preparación aquí también por seguridad

        this.id = prepared.id;
        this.item_name = prepared.item_name;
        this.description = prepared.description;
        this.parent_id = prepared.parent_id;
        this.order = prepared.order;
        this.type_id = prepared.type_id;
        this.is_favorite = prepared.is_favorite;
        this.status = prepared.status;
        this.special_type_id = prepared.special_type_id;
        this.color_id = prepared.color_id;
        this.created_at = new Date().toISOString();
        this.updated_at = new Date().toISOString();
        this.myColor = prepared.myColor;
    }

    static prepareData(data) {
        return {
            id: data.id ?? getUUID(),
            item_name: data.item_name ?? '',
            description: data.description ?? '',
            parent_id: data.parent_id ?? null,
            order: data.order ?? 0,
            type_id: data.type_id ?? null,
            is_favorite: data.is_favorite ?? false,
            status: data.status ?? 'pending',
            special_type_id: data.special_type_id ?? null,
            color_id: typeof data.color_id === 'number' ? data.color_id : 1,
            myColor: data.myColor ?? { id: 1, color: '0,0,0' },
            created_at: data.created_at ?? new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    }

    static validateData(data) {
        if (typeof data.item_name !== 'string' && typeof data.description !== 'string') {
            throw new Error("El tittle y description debe ser una cadena.");
        }
        if (data.created_at && !(data.created_at instanceof Date) && typeof data.created_at !== 'string') {
            throw new Error("El 'created_at' debe ser un objeto Date o una cadena ISO 8601.");
        }
        if (data.updated_at && !(data.updated_at instanceof Date) && typeof data.updated_at !== 'string') {
            throw new Error("El 'updated_at' debe ser un objeto Date o una cadena ISO 8601.");
        }
        if (typeof data.type_id !== 'number') {
            throw new Error("'type_id' es requerido y debe ser un número.");
        }
        if (typeof data.color_id !== 'number') {
            throw new Error("'color_id' debe ser un número.");
        }
        if (data.status && !['completed', 'pending', 'in_progress'].includes(data.status)) {
            throw new Error("'status' debe ser 'completed', 'pending' o 'in_progress'.");
        }
        if (data.parent_id && !validateUUID(data.parent_id)) {
            throw new Error("'parent_id' debe ser un UUID válido.");
        }
        if (data.myColor) {
            if (typeof data.myColor !== 'object' || data.myColor === null) {
              throw new Error("'myColor' debe ser un objeto.");
            }
            if (typeof data.myColor.id !== 'number') {
              throw new Error("'myColor.id' debe ser un número.");
            }
            if (typeof data.myColor.color !== 'string') {
              throw new Error("'myColor.color' debe ser una cadena de texto.");
            }
        }
    }
}

export {Item}
