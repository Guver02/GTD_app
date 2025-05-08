const sequelize = require('../db/connec');
const {models} = sequelize
const { COLORS_TABLE } = require('../db/models/colors.model');

class ColorsRepositorySequelize {
    constructor() {
        this.model = models[COLORS_TABLE];
    }

    async findAll(options) {
        return await models[COLORS_TABLE].findAll(options);
    }

    async findByPk(id) {
        return await models[COLORS_TABLE].findByPk(id);
    }

    async create(item) {
        return await models[COLORS_TABLE].create(item);
    }

    async update(item, options) {
        return await models[COLORS_TABLE].update(item, options);
    }

    async destroy(options) {
        return await models[COLORS_TABLE].destroy(options);
    }

    async findOne(options) {
        return await models[COLORS_TABLE].findOne(options);
    }

    async query(query, options) {

        return await sequelize.query(query, options); // Usa sequelize
    }


}

module.exports = {ColorsRepositorySequelize};
