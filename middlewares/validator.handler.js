const boom = require("@hapi/boom");

function validatorHandler (schema, property) {

    return (req, res, next) => {
        const data = req[property];
        console.log(`validatorHandler data ${property}`, data)

        const { error } = schema.validate(data, { abortEarly: false });
        if(error) {
            console.log('hay error')
            next(boom.badRequest(error))
        }else{
            next()
        }
    }
}
 module.exports = validatorHandler
