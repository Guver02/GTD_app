const config = require('../configuration/config')

const USER = config.dbUser
const PASSWORD = config.dbPassword

module.exports = {
    development: {
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
    },
    production: {
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
    },
    test: {
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
    }
}
