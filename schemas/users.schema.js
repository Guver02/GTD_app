const Joi = require('joi');

const id = Joi.string().uuid(); // CHAR(36) para UUID
const username = Joi.string().min(3).max(20); // STRING(20) con validación de longitud
const password = Joi.string().min(8).max(70); // STRING(70) para contraseñas
const email = Joi.string().email()

const createUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
    email: email.required()
}).unknown(false);

const updateUserSchema = Joi.object({
    username: username,
    password: password,
}).unknown(false);

const getUserSchema = Joi.object({
    id: id.required(),
}).unknown(false);

const loginUserSchema = Joi.object({
    username: username.required(),
    password: password.required(),
})

module.exports = { createUserSchema, updateUserSchema, getUserSchema, loginUserSchema };
