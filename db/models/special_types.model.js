const { Sequelize, DataTypes, Model } = require('sequelize');

const SPECIAL_TYPES_TABLE = 'special_types';

const specialTypesSchema = {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.ENUM(
            'sub-todo',
            'unsectioned',
            'inbox',
            'someday',
            'tracking-file',
            'waiting',
            'reference-file'),
        allowNull: false,
        unique: true,
    },
};

class SpecialTypes extends Model {
    static associate(models) {
        // Relación con la tabla items
        this.hasMany(models.items, {
            foreignKey: 'special_type_id',
            as: 'items',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: SPECIAL_TYPES_TABLE,
            timestamps: false, // Desactiva los timestamps automáticos
        };
    }
}

module.exports = { SPECIAL_TYPES_TABLE, SpecialTypes, specialTypesSchema };
