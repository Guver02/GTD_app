const { ItemsRepositorySequelize } = require('../../repositories/ItemsRepositorySequelize')
const ItemsService = require('./items.service')
const itemsService = new ItemsService(ItemsRepositorySequelize)
const boom = require('@hapi/boom')

class UsersServices {
    constructor(UserRepository){
        this.userRepository = UserRepository
    }

    async getByUser (username) {
        const user = this.userRepository.findOne({
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
        const result = this.userRepository.create(newUser)
        await itemsService.createInbox(result.dataValues.id)

        return (result)
    }
}

module.exports = UsersServices;
