const boom = require('@hapi/boom')

class UsersServices {
    constructor(UserRepository){
        this.userRepository = UserRepository
    }

    async getByUser (username) {
        const user = await this.userRepository.findOne({
            where: {
                username: username
            }
        })

        if(!user){
            throw boom.badRequest('Incorrect User');
        }

        return (user)
    }

    async getById (id) {
        const user = await this.userRepository.findById(id)

        if(!user){
            throw boom.badRequest('Incorrect User');
        }

        return (user)
    }

    async create (newUser) {
        const result = this.userRepository.create(newUser)
        return (result)
    }
}

module.exports = UsersServices;
