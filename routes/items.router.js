const express = require('express')
const router = express.Router()
const { ItemsRepositorySequelize } = require('../repositories/ItemsRepositorySequelize')
const { ColorsRepositorySequelize } = require('../repositories/ColorsRepositorySequelize')

const ItemsService = require('../services/data_services/items.service')


const itemsService = new ItemsService(new ItemsRepositorySequelize(), new ColorsRepositorySequelize())
const validatorHandler = require('./../middlewares/validator.handler')
const {getItemSchema, createItemTodoSchema, createItemFolderSchema, createItemSectionSchema, updateItemContentSchema, updateStatusItemTodo, changeOrderSameGroupSchema, changeTodoSectionToLastSchema} = require('./../schemas/items.schema')
const { authHandler } = require('../middlewares/auth.handler')
const AuthServices = require('./../services/business_services/auth.service')
const { userValidationHandler } = require('../middlewares/userValidator.handler')


const authServices = new AuthServices()

router.get('/test',
    async (req, res , next) => {
        try {
            const items = await itemsService.getItemsTest()
        res.json(items)
        } catch (error) {
            next(error)
        }
    }
)

router.get('/',
    authHandler,
    userValidationHandler,
    async (req, res , next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload



            const items = await itemsService.getItems(userId)

        res.json(items)
        } catch (error) {
            next(error)
        }
    }
)
router.post('/create-folder/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    validatorHandler(createItemFolderSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {id} = req.params

            const {body} = req
            const newItem =  await itemsService.createFolder(body, userId, id)
            res.json(newItem)
        } catch (error) {
            next(error)
        }
    }
)
router.post('/create-section',
    authHandler,
    validatorHandler(createItemSectionSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {body} = req
            const newItem =  await itemsService.createSection(body, userId)
            res.json(newItem)
        } catch (error) {
            next(error)
        }
    }
)
router.post('/create-todo',
    authHandler,
    validatorHandler(createItemTodoSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {body} = req
            const newItem =  await itemsService.createTodo(body, userId)
            res.json(newItem)
        } catch (error) {
            next(error)
        }
    }
)
router.put('/update-content/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    validatorHandler(updateItemContentSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {id} = req.params;
            const {body} = req

            const newValue = await itemsService.updateItem(id, body, userId)
            res.json(newValue)

        } catch (error) {
         next(error)
        }
     }
)

router.put('/todo-to-folder/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {id} = req.params

            const newValue = await itemsService.changeTodoToFolder(id, userId)
            res.json(newValue)
        } catch (error) {
         next(error)
        }
     }
)
router.put('/section-to-folder/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {id} = req.params

            const newValue = await itemsService.changeSectionToFolder(id, userId)
            res.json(newValue)
        } catch (error) {
         next(error)
        }
     }
)
router.put('/change-order-same-group',
    authHandler,
    validatorHandler(changeOrderSameGroupSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {sourceOrder, targetOrder, parent_id} = req.body

            const newValue = await itemsService.changeOrderSameGroup(sourceOrder, targetOrder, parent_id);
            res.json(newValue)
        } catch (error) {
         next(error)
        }
     }
)
router.put('/change-section/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    validatorHandler(changeOrderSameGroupSchema, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload


            const {id} = req.params
            const {sourceOrder, targetOrder, parent_id} = req.body

            await itemsService.moveTodotoSection(id, parent_id, userId);
            if(sourceOrder != targetOrder){
            const newValue = await itemsService.changeOrderSameGroup(sourceOrder, targetOrder, parent_id);
            res.json(newValue)
            }
        } catch (error) {
         next(error)
        }
     })

     router.put('/change-section-to-last/:id',
        authHandler,
        validatorHandler(getItemSchema, 'params'),
        validatorHandler(changeTodoSectionToLastSchema, 'body'),
        async (req, res, next) => {
            try {
                const {token} = req
                const payload = await authServices.getPayload(token)
                const {userId} = payload


                const {id} = req.params
                const {parent_id} = req.body

                const value = await itemsService.moveTodotoSection(id, parent_id, userId);

                res.json(value)
            } catch (error) {
             next(error)
            }
         })

router.put('/update-status-todo/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    validatorHandler(updateStatusItemTodo, 'body'),
    async (req, res, next) => {
        try {
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const {id} = req.params;
            const {body} = req

            const newValue = await itemsService.updateStatusTodo(id, body, userId)
            res.json(newValue)

        } catch (error) {
         next(error)
        }
     }
)
router.delete('/delete/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    async (req, res, next) => {
        try {
            const {id} = req.params;
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const newValue = await itemsService.deleteItem(id, userId)
            res.json(newValue)
        } catch (error) {
         next(error)
        }
     }
)

router.delete('/delete-project/:id',
    authHandler,
    validatorHandler(getItemSchema, 'params'),
    async (req, res, next) => {
        try {
            const {id} = req.params;
            const {token} = req
            const payload = await authServices.getPayload(token)
            const {userId} = payload

            const deleteProject = await itemsService.deleteProject(id, userId)
            res.json(deleteProject)
        } catch (error) {
         next(error)
        }
     }
)

module.exports = router
