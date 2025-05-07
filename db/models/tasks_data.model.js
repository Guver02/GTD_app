const { DataTypes, Model } = require('sequelize');
const { ITEMS_TABLE } = require('./items.model');

const TODOS_TABLE = 'todos';

const todoSchema = {
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
  due_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    allowNull: false,
    defaultValue: 'medium'
  }
};

class Todo extends Model {
  static associate(models) {
    this.belongsTo(models.items, {
      foreignKey: 'item_id',
      as: 'base'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      modelName: 'Todo',
      tableName: TODOS_TABLE,
      timestamps: false
    };
  }
}

module.exports = { TODOS_TABLE, Todo, todoSchema };
