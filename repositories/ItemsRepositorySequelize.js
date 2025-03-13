const {models, query: sequelizeQuery } = require('../db/connec');
const { ITEMS_TABLE } = require('../db/models/items.model');

class ItemsRepositorySequelize {

    async findAll(options) {
        return await models[ITEMS_TABLE].findAll(options);
    }

    async findById(id) {
        return await models[ITEMS_TABLE].findByPk(id);
    }

    async create(item) {
        return await models[ITEMS_TABLE].create(item);
    }

    async update(item, options) {
        return await models[ITEMS_TABLE].update(item, options);
    }

    async delete(options) {
        return await models[ITEMS_TABLE].destroy(options);
    }

    async findOne(options) {
        return await models[ITEMS_TABLE].findOne(options);
    }

    async query(query, options) {
        return await sequelizeQuery(query, options); // Usa sequelize
    }
}

module.exports = {ItemsRepositorySequelize};
