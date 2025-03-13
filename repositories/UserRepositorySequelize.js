const {USERS_TABLE} = require('../db/models/users.model')
const {models, query: sequelizeQuery } = require('../db/connec')

class UserRepositorySequelize {

    async findAll(options) {
        return await models[USERS_TABLE].findAll(options);
    }

    async findById(id) {
        return await models[USERS_TABLE].findByPk(id);
    }

    async create(item) {
        return await models[USERS_TABLE].create(item);
    }

    async update(item, options) {
        return await models[USERS_TABLE].update(item, options);
    }

    async delete(options) {
        return await models[USERS_TABLE].destroy(options);
    }

    async findOne(options) {
        return await models[USERS_TABLE].findOne(options);
    }

    async query(query, options) {
        return await sequelizeQuery(query, options); // Usa sequelize
    }
}

module.exports = {UserRepositorySequelize};
