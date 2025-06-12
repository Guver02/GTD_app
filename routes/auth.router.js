const express = require('express')
const router = express.Router()
const {createUserSchema, loginUserSchema} = require('./../schemas/users.schema')
const validatorHandler = require('./../middlewares/validator.handler')

const { ItemsRepositorySequelize } = require('../repositories/ItemsRepositorySequelize')
const ItemsService = require('../services/data_services/items.service')
const itemsService = new ItemsService(new ItemsRepositorySequelize())

const {UserRepositorySequelize} = require('../repositories/UserRepositorySequelize')
const UserServices = require('../services/data_services/users.service')
const userServices = new UserServices(new UserRepositorySequelize())

const AuthService = require('./../services/business_services/auth.service')


const authService = new AuthService(itemsService, userServices)

router.post('/sing-in',
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const {body} = req
            const token = await authService.signIn(body)
            res.json({token})
        } catch (error) {
            next(error)
        }
    }
)

router.post('/login',
    validatorHandler(loginUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const {body} = req
            const token = await authService.logIn(body)

            res.json({token})
        } catch (error) {
            next(error)
        }
    }
)

module.exports = router

