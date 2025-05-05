// EXPORTACION DE NUESTROS MODELOS
const { Items, itemsSchema } = require('./items.model');
const { Users, usersSchema } = require('./users.model');
const { ItemTypes, itemTypesSchema} = require('./item_types.model');
const { SpecialTypes, specialTypesSchema } = require('./special_types.model');
const { Colors, schemaColorsSeq} = require('./colors.model')


// INICIACION DE MODELOS PARA EXPORTAR
function setupModels(sequelize) {
    // Inicialización de los modelos
    Items.init(itemsSchema, Items.config(sequelize));
    Users.init(usersSchema, Users.config(sequelize));
    ItemTypes.init(itemTypesSchema, ItemTypes.config(sequelize))
    SpecialTypes.init(specialTypesSchema, SpecialTypes.config(sequelize));
    Colors.init(schemaColorsSeq, Colors.config(sequelize));


    // Establecimiento de asociaciones
    Items.associate(sequelize.models);
    Users.associate(sequelize.models);
    ItemTypes.associate(sequelize.models);
    SpecialTypes.associate(sequelize.models);
    Colors.associate(sequelize.models);
}

module.exports = setupModels;
