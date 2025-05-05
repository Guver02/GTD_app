const { Sequelize, DataTypes, Model } = require('sequelize');

const COLORS_TABLE = 'colors';

const schemaColorsSeq = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

class Colors extends Model {
  static associate(models) {
    // Relaciones aquí si quieres
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: COLORS_TABLE,
      modelName: COLORS_TABLE,
      timestamps: false,
    };
  }
}

module.exports = { COLORS_TABLE, Colors, schemaColorsSeq };
