const {models} = require('./../db/connec')
const {USERS_TABLE} = require('./../db/models/users.model')
const ItemsService = require('./items.service')
const itemsService = new ItemsService()
const boom = require('@hapi/boom')

class UsersServices {
    constructor(){
    }

    async getByUser (username) {
        const user = await models[USERS_TABLE].findOne({
            where: {
                username: username
            }
        })

        if(!user){
            throw new Error(boom.badRequest('Incorrect User'));
        }

        return (user)
    }

    async create (newUser) {
        const result = await models[USERS_TABLE].create(newUser)
        await itemsService.createInbox(result.dataValues.id)

        return (result)
    }
}

module.exports = UsersServices;
