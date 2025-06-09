const bcrypt = require('bcrypt')
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const config = require('../../configuration/config')

class AuthServices {
    constructor(ItemsService, UserServices){
        this.itemsService = ItemsService;
        this.userServices = UserServices
    }

    async signIn(body) {
        const {password} = body
        const passForTheDB = await bcrypt.hash(password, 10)

        const newUser = {
            ...body,
            password: passForTheDB
        }
        const result = await this.userServices.create(newUser)
        await this.itemsService.createDefaultProjects(result.dataValues.id)

        //delete result.dataValues.password
        //delete result.dataValues.id

        const payload = {
            userId: result.dataValues.id,
            username: result.dataValues.username,
            email: result.dataValues.email
        }

        const token = jwt.sign(payload, config.secretKey)

        return (token)
    }

    async logIn(body){
        const {username, password} = body
        const user = await this.userServices.getByUser(username)

        if(!user){
            boom.unauthorized('Incorrect credentials')
            return
        }

        const isMatch = await bcrypt.compare(password, user.dataValues.password)
        if(!isMatch){
            boom.unauthorized('Incorrect password')
            return;
        }

        const payload = {
            userId: user.dataValues.id,
            username: user.dataValues.username,
            email: user.dataValues.email
        }

        const token = jwt.sign(payload, config.secretKey)

        return (token)
    }

    async getPayload(token) {
        const payload = jwt.verify(token, config.secretKey)
        return payload
    }

    async userValidate(token){
        const payload = await this.getPayload(token)
        const user = await this.userServices.findById(payload.userId)

        if (user) return true
    }
}

module.exports = AuthServices;
