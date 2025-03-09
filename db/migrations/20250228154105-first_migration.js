'use strict';
const { USERS_TABLE, usersSchema} = require('./../models/users.model')
const { ITEM_TYPES_TABLE, itemTypesSchema} = require('../models/item_types.model')
const { ITEMS_TABLE, itemsSchema} = require('./../models/items.model');
const { SPECIAL_TYPES_TABLE, specialTypesSchema } = require('../models/special_types.model');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USERS_TABLE, usersSchema);
    await queryInterface.createTable(ITEM_TYPES_TABLE, itemTypesSchema);
    await queryInterface.createTable(SPECIAL_TYPES_TABLE, specialTypesSchema);
    await queryInterface.createTable(ITEMS_TABLE, itemsSchema);


    const types = [
        {name: 'todo'},
        {name: 'section'},
        {name: 'folder'}
    ]

    const specialTypes = [
        {name: 'sub-todo'},
        {name: 'unsectioned'},
        {name: 'inbox'}
    ]

    await queryInterface.bulkInsert(ITEM_TYPES_TABLE, types)
    await queryInterface.bulkInsert(SPECIAL_TYPES_TABLE, specialTypes)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(USERS_TABLE);
    await queryInterface.dropTable(ITEM_TYPES_TABLE);
    await queryInterface.dropTable(SPECIAL_TYPES_TABLE);
    await queryInterface.dropTable(ITEMS_TABLE);

  }
};
