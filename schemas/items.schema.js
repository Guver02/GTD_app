const Joi = require('joi');

// Definición de los esquemas básicos
const id = Joi.string().uuid();
const item_name = Joi.string().max(255);
const description = Joi.string().allow(null);
const parent_id = Joi.string().uuid();
const order = Joi.number().integer().min(0);
const user_id = Joi.string().uuid();
const type_id = Joi.number().integer().min(1); // type_id es un entero sin signo
const is_favorite = Joi.boolean();
const status = Joi.string().valid('completed', 'pending', 'in_progress').default('pending');

const createItemFolderSchema = Joi.object({
    id: id.required(),
    item_name: item_name.required(),
    description: description,
    parent_id: parent_id.allow(null).valid(null).required(),
    //order: order.required(),
    type_id: type_id.valid(3).required(),
    is_favorite: is_favorite.default(false),
}).unknown(false);

const createItemSectionSchema = Joi.object({
    id: id.required(),
    item_name: item_name.required(),
    description: description,
    parent_id: parent_id.required(),
    //order: order.required(),
    type_id: type_id.valid(2).required(),
    is_favorite: is_favorite.default(false),
}).unknown(false);

// Esquema para crear un todo
const createItemTodoSchema = Joi.object({
    id: id.required(),
    item_name: item_name.required(),
    description: description,
    parent_id: parent_id.required(),
    //order: order.required(),
    type_id: type_id.valid(1).required(),
    is_favorite: is_favorite.default(false),
    status: status,
}).unknown(false);

// Esquema para actualizar un ítem
const updateItemContentSchema = Joi.object({
    item_name: item_name,
    description: description,
    is_favorite: is_favorite,
}).unknown(false);

const updateStatusItemTodo = Joi.object({
    status: status.required(),
}).unknown(false);

const getItemSchema = Joi.object({
    id: id.required(),
}).unknown(false);

const changeOrderSameGroupSchema = Joi.object({
    parent_id: id.allow(null).required(),
    sourceOrder: order.required(),
    targetOrder: order.required()
}).unknown(false);

module.exports = {
    createItemFolderSchema,
    createItemSectionSchema,
    createItemTodoSchema,
    getItemSchema,
    updateItemContentSchema,
    updateStatusItemTodo,
    changeOrderSameGroupSchema
};
