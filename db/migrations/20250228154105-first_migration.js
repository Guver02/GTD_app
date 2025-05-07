'use strict';
const { USERS_TABLE, usersSchema} = require('./../models/users.model')
const { ITEM_TYPES_TABLE, itemTypesSchema} = require('../models/item_types.model')
const { ITEMS_TABLE, itemsSchema} = require('./../models/items.model');
const { SPECIAL_TYPES_TABLE, specialTypesSchema } = require('../models/special_types.model');
const { COLORS_TABLE, schemaColorsSeq} = require('../models/colors.model')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USERS_TABLE, usersSchema);
    await queryInterface.createTable(COLORS_TABLE, schemaColorsSeq)
    await queryInterface.createTable(ITEM_TYPES_TABLE, itemTypesSchema);
    await queryInterface.createTable(SPECIAL_TYPES_TABLE, specialTypesSchema);
    await queryInterface.createTable(ITEMS_TABLE, itemsSchema);


    const types = [
        {name: 'todo'},
        {name: 'section'},
        {name: 'folder'},
        /*{name: 'thing'},
        {name: 'note'},*/
    ]

    const specialTypes = [
        {name: 'sub-todo'},
        {name: 'unsectioned'},
        {name: 'inbox'},
        {name: 'someday' },
        {name: 'tracking-file' },
        {name: 'waiting' },
        {name: 'reference-file' }
    ]
    const colors = [
        { color: '0,0,0' },
        { color: "255,0,0" },
        { color: "0,255,0" },
        { color: "0,0,255" },
        { color: "255,255,0" },
        { color: "255,0,255" },
        { color: "0,255,255" },
        { color: "128,0,0" },
      ]

    await queryInterface.bulkInsert(COLORS_TABLE, colors)
    await queryInterface.bulkInsert(ITEM_TYPES_TABLE, types)
    await queryInterface.bulkInsert(SPECIAL_TYPES_TABLE, specialTypes)
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(ITEMS_TABLE);
    await queryInterface.dropTable(SPECIAL_TYPES_TABLE);
    await queryInterface.dropTable(ITEM_TYPES_TABLE);
    await queryInterface.dropTable(COLORS_TABLE)
    await queryInterface.dropTable(USERS_TABLE);

  }
};
