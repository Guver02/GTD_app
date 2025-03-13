const bcrypt = require('bcrypt')
const UserServices = require('../data_services/users.service')
const {UserRepositorySequelize} = require('../../repositories/UserRepositorySequelize')
const userServices = new UserServices(new UserRepositorySequelize())
const boom = require('@hapi/boom')
const jwt = require('jsonwebtoken')
const config = require('../../configuration/config')

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

        const payload = {
            userId: user.dataValues.id,
            username: user.dataValues.username,
            email: user.dataValues.email
        }

        const token = jwt.sign(payload, secretKey)

        return (token)
    }

    /*async getPayload(){
        const token = jwt.sign(payload, secretKey)
        return
    }*/
}

module.exports = AuthServices;
