const { Sequelize, DataTypes, Model } = require('sequelize');
const { ITEM_TYPES_TABLE } = require('./item_types.model');
const { USERS_TABLE } = require('./users.model');
const { SPECIAL_TYPES_TABLE } = require('./special_types.model');
const { COLORS_TABLE } = require('./colors.model');

const ITEMS_TABLE = 'items';

const defaultValues = {
    colorId: 1
}

const itemsSchema = {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    item_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: ITEMS_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    order: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: USERS_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: ITEM_TYPES_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    is_favorite: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    status: {
        type: DataTypes.ENUM('completed', 'pending', 'in_progress'), // ENUM para estados predefinidos
        allowNull: false,
        defaultValue: 'pending', // Valor predeterminado
    },
    special_type_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
            model: SPECIAL_TYPES_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    color_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: defaultValues.colorId,
        references: {
            model: COLORS_TABLE,
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
    },
    activation_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    is_next: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }
};

class Items extends Model {
    static associate(models) {

        this.belongsTo(models[ITEM_TYPES_TABLE], {
            foreignKey: 'type_id',
            as: 'type',
        });
        this.belongsTo(models[SPECIAL_TYPES_TABLE], {
            foreignKey: 'special_type_id',
            as: 'special_type'
        })

        // Relación consigo misma para jerarquías (parent_id)
        this.belongsTo(models.items, {
            foreignKey: 'parent_id',
            as: 'parent',
        });
        this.hasMany(models.items, {
            foreignKey: 'parent_id',
            as: 'subItems'
        })

        // Relación con la tabla users
        this.belongsTo(models.users, {
            foreignKey: 'user_id',
            as: 'user',
        })

        this.belongsTo(models.colors, {
            foreignKey: 'color_id',
            as: 'myColor',
        });

    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: ITEMS_TABLE,
            timestamps: false,
            hooks: {
                beforeCreate: (item) => {
                    const now = new Date();
                    if (!item.created_at) item.created_at = now;
                    if (!item.updated_at) item.updated_at = now;
                },

                beforeUpdate: (item) => {
                    item.updated_at = new Date(); // Actualiza la fecha de actualización
                },
            },
        };
    }
}

module.exports = { ITEMS_TABLE, Items, itemsSchema };
