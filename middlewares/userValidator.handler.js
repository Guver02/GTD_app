const boom = require("@hapi/boom");
const AuthServices = require("../services/business_services/auth.service");
const ItemsService = require("../services/data_services/items.service");
const UsersServices = require("../services/data_services/users.service");
const {UserRepositorySequelize} = require("../repositories/UserRepositorySequelize")
const userService = new UsersServices(new UserRepositorySequelize())

async function userValidationHandler(req, res, next) {
    try {
        const {token} = req
        const payload = await AuthServices.getPayload(token)
        const {userId} = payload

        const user = await userService.getById(userId)

        if (!user) {
            next(boom.notFound('User not found'));
            return;
        }
        req.user = user;
        next();
    } catch (error) {
        next(boom.internal('Database error'));
    }
}

export {userValidationHandler}
