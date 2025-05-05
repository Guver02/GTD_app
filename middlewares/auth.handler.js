const boom = require("@hapi/boom");

function authHandler(req, res, next) {
    console.log('AUTH MIDD')
    if(!req.headers.authorization){
        next(boom.unauthorized('Access denied'))
        return
    }

    if (req.headers.authorization){
        var tokenWithBearer = req.headers.authorization;
        var token = tokenWithBearer.replace("Bearer ", "");

        req.token = token

        next()
    }
}

module.exports = {authHandler}
