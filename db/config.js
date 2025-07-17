const config = require('../configuration/config')

const USER = config.dbUser
const PASSWORD = config.dbPassword

module.exports = {
    development: {
        uriLink: config.uriLink,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        port: config.devDbPort
    },
    production: {
        uriLink: config.uriLink,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        port: config.dbPort
    },
    test: {
        uriLink: config.uriLinkTest,
        username: config.dbUser,
        password: config.dbPassword,
        database: config.dbNameTest,
        host: config.dbHost,
        dialect: 'mysql',
        port: config.dbPort
    }
}
