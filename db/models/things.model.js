const { DataTypes, Model } = require('sequelize');
const { ITEMS_TABLE } = require('./items.model');

const THINGS_TABLE = 'things';

const thingsSchema = {
  item_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    references: {
      model: ITEMS_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  activationDate: {
    type: DataTypes.JSON,
    allowNull: true
  }
};

class Things extends Model {
  static associate(models) {
    this.belongsTo(models.items, {
      foreignKey: 'item_id',
      as: 'base'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      modelName: THINGS_TABLE,
      timestamps: false
    };
  }
}

module.exports = { THINGS_TABLE, Things, thingsSchema };
