const express = require('express')
const itemsRouter = require('./items.router')
const authRouter = require('./auth.router')

function routerApi (app){
    const routerv1 = new express.Router()

    routerv1.use('/items',itemsRouter)
    routerv1.use('/auth', authRouter)

    app.use('/api/v1', routerv1)
}

module.exports = routerApi
