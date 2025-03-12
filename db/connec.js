const config = require('../configuration/config.js')
const configDB = require('./config.js')
const {Sequelize} = require ('sequelize');

const setupModels = require('./models/index.js')

const nodeEnv = config.env
//const sequelize = new Sequelize(config.uriLink,{
//const sequelize = new Sequelize(config.dbName, config.dbUser, config.dbPassword,{
const sequelize = new Sequelize(configDB[nodeEnv].database , configDB[nodeEnv].username, configDB[nodeEnv].password,{

    //host: configDB[nodeEnv].dbHost,

    dialect: 'mysql',
    logging: false,
    define: {
        freezeTableName: true,
        timestamps: false,

      },
      pool: {
        max: 5, // Número máximo de conexiones en el pool
        min: 0, // Número mínimo de conexiones en el pool
        acquire: 30000, // Tiempo máximo que Sequelize intentará establecer la conexión antes de arrojar un error
        idle: 10000 // Tiempo máximo que una conexión puede estar inactiva antes de ser liberada
      }

});

//sequelize.authenticate().then().catch()
setupModels(sequelize);


//sequelize.sync()

module.exports = sequelize
