'use strict';

const { ITEMS_TABLE } = require('../models/items.model');
const columName = 'is_next';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const attributes = {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    }

    await queryInterface.addColumn(ITEMS_TABLE, columName, attributes);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(ITEMS_TABLE, columName);
  }
};
