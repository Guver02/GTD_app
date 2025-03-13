const express = require('express')
const router = express.Router()
const {createUserSchema, loginUserSchema} = require('./../schemas/users.schema')
const validatorHandler = require('./../middlewares/validator.handler')
const AuthService = require('./../services/business_services/auth.service')
const boom= require('@hapi/boom')
const jwt = require('jsonwebtoken')
const {secretKey} = require('./../configuration/config')

const authService = new AuthService()

router.post('/sing-in',
    validatorHandler(createUserSchema, 'body'),
    async (req, res, next) => {
        try {
            const {body} = req
            const user = await authService.signIn(body)
            res.json(user)
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

