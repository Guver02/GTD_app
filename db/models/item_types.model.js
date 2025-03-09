const { Sequelize, DataTypes, Model } = require('sequelize');

const ITEM_TYPES_TABLE = 'item_types';

const itemTypesSchema = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.ENUM('todo', 'section', 'folder'), // ENUM para los tipos predefinidos
        allowNull: false,
        unique: true,
    },
};

class ItemTypes extends Model {
    static associate(models) {
        // Relación con la tabla items
        this.hasMany(models.items, {
            foreignKey: 'type_id',
            as: 'items',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: ITEM_TYPES_TABLE,
            timestamps: false, // Desactiva los timestamps automáticos
        };
    }
}

module.exports = { ITEM_TYPES_TABLE, ItemTypes, itemTypesSchema };
