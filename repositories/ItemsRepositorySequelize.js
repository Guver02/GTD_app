const sequelize = require('../db/connec');
const {models} = sequelize
const { ITEMS_TABLE } = require('../db/models/items.model');

class ItemsRepositorySequelize {
    constructor() {
        this.model = models[ITEMS_TABLE];
    }

    async findAll(options) {
        return await models[ITEMS_TABLE].findAll(options);
    }

    async findByPk(id) {
        return await models[ITEMS_TABLE].findByPk(id);
    }

    async create(item) {
        return await models[ITEMS_TABLE].create(item);
    }

    async update(item, options) {
        return await models[ITEMS_TABLE].update(item, options);
    }

    async destroy(options) {
        return await models[ITEMS_TABLE].destroy(options);
    }

    async findOne(options) {
        return await models[ITEMS_TABLE].findOne(options);
    }

    async query(query, options) {
        console.log('OPT', options)

        return await sequelize.query(query, options); // Usa sequelize
    }


}

module.exports = {ItemsRepositorySequelize};
