const { Sequelize, DataTypes, Model } = require('sequelize');

const USERS_TABLE = 'users';

const usersSchema = {
    id: {
        type: DataTypes.UUID, // Usar CHAR(36) para UUID
        defaultValue: DataTypes.UUIDV4, // Generar automáticamente un UUID
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true, // Asegurar que el nombre de usuario sea único
        validate: {
            len: [3, 20], // Validar longitud mínima y máxima
        },
    },
    email: {
        type: DataTypes.STRING(100), // VARCHAR(100) para el email
        allowNull: false,
        unique: true, // Asegurar que el email sea único
        validate: {
            isEmail: true, // Validar que el campo sea un email válido
        },
    },
    password: {
        type: DataTypes.STRING(70),
        allowNull: false,
        validate: {
            len: [8, 70], // Validar longitud mínima y máxima
        },
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
};

class Users extends Model {
    static associate(models) {
        // Relaciones con otras tablas
        this.hasMany(models.items, {
            foreignKey: 'user_id',
            as: 'items',
        });
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: USERS_TABLE,
            timestamps: false, // Desactivar timestamps automáticos
            hooks: {
                beforeCreate: (user) => {
                    const now = new Date();
                    if (!user.created_at) user.created_at = now;
                    if (!user.updated_at) user.updated_at = now;
                  },

                beforeUpdate: (user) => {
                    user.updated_at = new Date(); // Actualizar fecha de actualización
                },
            },
            indexes: [
                {
                    unique: true,
                    fields: ['username'], // Índice único para el campo username
                },
                {
                    unique: true,
                    fields: ['email'], // Índice único para el campo email
                },
            ],
        };
    }
}

module.exports = { USERS_TABLE, Users, usersSchema };
