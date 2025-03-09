const bcrypt = require('bcrypt')
const UserServices = require('./users.service')
const userServices = new UserServices()
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const config = require('../configuration/config')

class AuthServices {
    constructor(){
    }

    async signIn(body) {
        const {password} = body
        const passForTheDB = await bcrypt.hash(password, 10)

        const newUser = {
            ...body,
            password: passForTheDB
        }
        const result = await userServices.create(newUser)

        delete result.dataValues.password

        return (result)
    }

    async logIn(body){
        const {username, password} = body
        const user = await userServices.getByUser(username)

        if(!user){
            boom.unauthorized('Incorrect credentials')
            return
        }

        const isMatch = await bcrypt.compare(password, user.dataValues.password)
        if(!isMatch){
            boom.unauthorized('Incorrect password')
            return;
        }

        return {
            ...user,
            credentials: true
        }
    }

    async getPayload(token) {
        const payload = await jwt.verify(token, config.secretKey)
        return payload
    }

}

module.exports = AuthServices;
