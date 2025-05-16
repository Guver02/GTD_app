const boom = require("@hapi/boom");
const { Op, QueryTypes } = require("sequelize");

const itemTypesIDS = {
    todo: 1,
    section: 2,
    folder: 3
}
const specialTypesIDS = {
    subTodo: 1,
    unsectioned: 2,
    inbox: 3,
    someday: 4,
    trackingFile: 5,
    waiting: 6,
    referenceFile: 7,
  };


class ItemsService {
    constructor(ItemsRepository, ColorsRepository){
        this.itemsRepository = ItemsRepository
        this.colorsRepository = ColorsRepository
    }



    async getItemsTest() {
        try {
            const items = await this.itemsRepository.findAll({
                where: {

                    parent_id: null,
                    type_id: 3
                },
                order: [['order', 'ASC']],  // Ordena los elementos raíz
                include: [
                    {
                        model: this.itemsRepository.model,
                        as: 'subitems',
                        required: false,
                        where: {  type_id: 2 },
                        order: [['order', 'ASC']],  // 🔹 Ordenar subitems correctamente
                        separate: true, // 🔥 Permite que Sequelize aplique ORDER correctamente
                        include: [
                            {
                                model: this.itemsRepository.model,
                                as: 'subitems',
                                required: false,
                                where: {  type_id: 1 },
                                order: [['order', 'ASC']],  // 🔹 Ordenar sub-subitems correctamente
                                separate: true,
                                include: [
                                    {
                                        model: this.itemsRepository.model,
                                        as: 'subitems',
                                        required: false,
                                        where: {  type_id: 1, special_type_id: 1 },
                                        order: [['order', 'ASC']],  // 🔹 Ordenar sub-sub-subitems correctamente
                                        separate: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            });



          return (items);
        } catch (error) {
          throw (boom.internal('Internal error', error));
        }
}

async getItems(userId) {
    try {
        const folders = await this.itemsRepository.findAll({
            where: { user_id: userId, parent_id: null, type_id: 3 },
            include: ['myColor', 'subItems'],
            order: [['order', 'ASC']],
        });

        const sections = await this.itemsRepository.findAll({
            where: { user_id: userId, type_id: 2 },
            order: [['order', 'ASC']],
        });

        const todos = await this.itemsRepository.findAll({
            where: { user_id: userId, type_id: 1, special_type_id: null },
            include: ['myColor'],
            order: [['order', 'ASC']],
        });

        const subTodos = await this.itemsRepository.findAll({
            where: { user_id: userId, type_id: 1, special_type_id: 1 },

            order: [['order', 'ASC']],
        });

        const inbox = await this.itemsRepository.findOne({
            where: {user_id: userId, special_type_id: specialTypesIDS.inbox}
        })

        const specialProjects = await this.itemsRepository.findAll({
            where: {
                user_id: userId,
                type_id: itemTypesIDS.folder,
                special_type_id: {
                    [Op.or]: [
                        specialTypesIDS.inbox,
                        specialTypesIDS.referenceFile,
                        specialTypesIDS.someday,
                        specialTypesIDS.trackingFile,
                        specialTypesIDS.waiting
                    ]
                }}
        })

        const unsections = await this.itemsRepository.findAll({
            where: {user_id: userId, special_type_id: specialTypesIDS.unsectioned}
        })

        const colors = await this.colorsRepository.findAll()

        return {
            folders: folders,
            specialProjects: specialProjects,

            sections: sections,
            todos: todos,
            subTodos: subTodos,
            inbox: inbox,
            unsections: unsections,
            colors: colors
        };
    } catch (error) {
        throw boom.internal('Internal error', error);
    }
}

    async createTodo(body, userId) {

        const {parent_id} = body
        const TodoOrSectionParentOfTheTodo = await this.itemsRepository .findOne({
            where:{
                id: parent_id,
                user_id: userId,
                [Op.or]: [
                    {type_id: itemTypesIDS.todo},
                    {type_id: itemTypesIDS.section}
                ]
            }
        })

        if(!TodoOrSectionParentOfTheTodo){
//            throw new Error(boom.badData('The defined item for this to-do does not exist'));
            throw boom.badData('The defined item for this to-do does not exist');
        }

        const actLastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, parent_id)

        const newItem = await this.itemsRepository .create({
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.todo,
            parent_id: TodoOrSectionParentOfTheTodo.dataValues.id,
            order: actLastOrder
        })

        delete newItem.dataValues.user_id

        return (newItem)
    }

    async createSection(body, userId) {
        const {parent_id} = body

        const folderOfTheSection = await this.itemsRepository .findOne({
            where:{
                id: parent_id,
                user_id: userId,
                type_id: itemTypesIDS.folder
            }
        })

        if(!folderOfTheSection){
            throw new Error(boom.badData('The defined folder for this section does not exist'));
        }

        const actLastOrder = await this.getActualLastOrder(itemTypesIDS.section, userId)

        const newItem = await this.itemsRepository .create({
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.section,
            parent_id: folderOfTheSection.dataValues.id,
            order: actLastOrder
        })

        delete newItem.dataValues.user_id

        return (newItem)
    }

    async createFolder(body, userId, unsectionId) {
        const actLastOrder = await this.getActualLastOrder(itemTypesIDS.folder, userId)


        const newItem = await this.itemsRepository .create({
            ...body,
            user_id: userId,
            type_id: itemTypesIDS.folder,
            parent_id: null,
            order: actLastOrder
        })
        await this.createUnsectioned(newItem.dataValues.id, userId, unsectionId)

        delete newItem.dataValues.user_id

        return (newItem)
    }

    async createDefaultProjects(userID) {

        const defaultProjects = [
            {
                item_name: 'INBOX',
                user_id: userID,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 0,
                special_type_id: specialTypesIDS.inbox
            },
            {
                item_name: 'SOMEDAY',
                user_id: userID,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 1,
                special_type_id: specialTypesIDS.someday
            },
            {
                item_name: 'TRACKING FILE',
                user_id: userID,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 2,
                special_type_id: specialTypesIDS.trackingFile
            },
            {
                item_name: 'WAITING',
                user_id: userID,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 3,
                special_type_id: specialTypesIDS.waiting
            },
            {
                item_name: 'REFERENCE FILE',
                user_id: userID,
                type_id: itemTypesIDS.folder,
                parent_id: null,
                order: 4,
                special_type_id: specialTypesIDS.referenceFile
            }
        ];



        const defaultInstances = await this.itemsRepository.bulkCreate(defaultProjects)

        await Promise.all(
            defaultInstances.map(item => this.createUnsectioned(item.id, userID))
        );

    }

    async createUnsectioned(folderID, userID, unsectionId) {
        let data = {}
        if(unsectionId){
            data = {
                id: unsectionId,
                item_name: 'UNSECTIONED',
                user_id: userID,
                type_id: itemTypesIDS.section,
                parent_id: folderID,
                order: 0,
                special_type_id: specialTypesIDS.unsectioned
            }
        }else{
            data = {
                item_name: 'UNSECTIONED',
                user_id: userID,
                type_id: itemTypesIDS.section,
                parent_id: folderID,
                order: 0,
                special_type_id: specialTypesIDS.unsectioned
            }
        }

        const unsectioned = await this.itemsRepository .create(data)

        return (unsectioned)
    }

    async getActualLastOrder(typeItemId, userId){
        const lastItemType = await this.itemsRepository .findOne({
            where:{
                user_id: userId,
                type_id: typeItemId,
            },
            order: [['order', 'DESC']]
        })
        const actualLastOrder = lastItemType ? lastItemType.order + 1 : 0
        return (actualLastOrder)
    }

    async getActualLastOrderForTodos(typeItemId, userId, parentId){
        const lastItemType = await this.itemsRepository .findOne({
            where:{
                user_id: userId,
                type_id: typeItemId,
                parent_id: parentId
            },
            order: [['order', 'DESC']]
        })
        const actualLastOrder = lastItemType ? lastItemType.order + 1 : 0
        return (actualLastOrder)
    }

    async updateItem(id, newData, userId) {
        const itemEdited = this.itemsRepository .findOne({
            where: {
                id: id,
                user_id: userId,
            }
        })

        if(!itemEdited){
            throw new Error(boom.badData("The item does not exist"));

        }

        const newItem = this.itemsRepository .update(newData, {
            where: {
                id: id,
                user_id: userId
            }
        })

        return (newItem)

    }

    async updateStatusTodo(id, newData, userId) {
        const itemEdited = this.itemsRepository .findOne({
            where: {
                id: id,
                user_id: userId,
                type_id: itemTypesIDS.todo
            }
        })

        if(!itemEdited){
            throw new Error(boom.badData("The item does not exist"));

        }

        const newItem = this.itemsRepository .update(newData, {
            where: {
                id: id,
                user_id: userId
            }
        })

        return (newItem)

    }

    async deleteItem(itemId, userId) {
        const itemDeleted = await this.itemsRepository.findByPk(itemId)



        const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, itemDeleted.dataValues.parent_id)

        await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: itemDeleted.dataValues.order,
            target: lastOrder,
            parentId: itemDeleted.dataValues.parent_id
        },
        type: QueryTypes.UPDATE
        })

        await this.itemsRepository.destroy({
            where: {
              user_id: userId,
              [Op.or]: [
                { id: itemId },
                { parent_id: itemId }
              ]
            }
          });

        return (itemDeleted)
    }

    async deleteProject (projectId, userID) {

        try {
            // Verifica que el proyecto existe y es de tipo 3
            const project = await this.itemsRepository.findByPk(projectId);
            if (!project) {
              throw new Error('Proyecto no encontrado o no es del tipo correcto');
            }

            const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.folder, userID, project.dataValues.parent_id)

            await this.itemsRepository.query(`
                UPDATE items
                SET \`order\` = CASE
                    WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                    ELSE \`order\`
                END
                WHERE \`order\` BETWEEN :source AND :target
                    AND user_id = :parentId;
            `,{
            replacements:{
                source: project.dataValues.order,
                target: lastOrder,
                parentId: userID
            },
            type: QueryTypes.UPDATE
            })


            // Obtiene las secciones del proyecto
            const sections = await this.itemsRepository.findAll({
              where: {
                parent_id: projectId,
                type_id: 2
              }
            });

            const sectionIds = sections.map(section => section.id);

            if (sectionIds.length > 0) {
              // Elimina las tareas de esas secciones
              await this.itemsRepository.destroy({
                where: {
                  parent_id: sectionIds,
                  type_id: 1
                }
              });

              // Elimina las secciones
              await this.itemsRepository.destroy({
                where: {
                  id: sectionIds
                }
              });
            }

            // Finalmente, elimina el proyecto
            const deleteProject = await this.itemsRepository.destroy({
              where: {
                id: projectId
              }
            });


            return(deleteProject)
          } catch (error) {
            console.error('Error al eliminar:', error);
          }
    }


    async changeTodoToFolder (todoId, userId) {
        const newFolder = await this.itemsRepository .findByPk(todoId);
        if(!newFolder){
            throw new Error(boom.badData('This item does not exist'));
        }
        if(newFolder.dataValues.type_id != itemTypesIDS.todo){
            throw new Error(boom.badData('This item is not a to-do'));
        }

        const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, newFolder.dataValues.parent_id)
        //EDITAR todos los orders de los todos debido a que uno de ellos se ha "eliminado"
          await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: newFolder.dataValues.order,
            target: lastOrder,
            parentId: newFolder.dataValues.parent_id
        },
        type: QueryTypes.UPDATE
        })

        const newOrder = await this.getActualLastOrder(itemTypesIDS.folder, userId)
        newFolder.type_id = itemTypesIDS.folder
        newFolder.order = newOrder
        newFolder.save()

        //create unsection para el nuevo folder
        const unsectioned = await this.createUnsectioned(newFolder.id, userId);

        //change subtodos to todos
        await this.itemsRepository .update({
            type_id: itemTypesIDS.todo,
            special_type_id: null,
            parent_id: unsectioned.dataValues.id
        },{
            where: {
                user_id: userId,
                parentId: todoId
            }
        })

await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: newFolder.dataValues.order,
            target: lastOrder,
            parentId: newFolder.dataValues.parent_id
        },
        type: QueryTypes.UPDATE
        })

        return(newFolder)
    }



    async changeSectionToFolder (sectionID, userId) {
        const newFolder = await this.itemsRepository .findByPk(sectionID);
        if(!newFolder){
            throw new Error(boom.badData('This item does not exist'));
        }
        if(newFolder.dataValues.type_id != itemTypesIDS.todo){
            throw new Error(boom.badData('This item is not a section'));
        }

        const lastOrder = await this.getActualLastOrderForTodos(itemTypesIDS.section, userId, newFolder.dataValues.parent_id)
        //EDITAR todos los orders de los todos debido a que uno de ellos se ha "eliminado"
          await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: newFolder.dataValues.order,
            target: lastOrder,
            parentId: newFolder.dataValues.parent_id
        },
        type: QueryTypes.UPDATE
        })

        const newOrder = await this.getActualLastOrder(itemTypesIDS.folder, userId)
        newFolder.type_id = itemTypesIDS.folder
        newFolder.order = newOrder
        await newFolder.save()

        //create unsection para el nuevo folder
        const unsectioned = await this.createUnsectioned(newFolder.id, userId);

        //change subtodos to todos
        await this.itemsRepository .update({
            parent_id: unsectioned.dataValues.id
        },{
            where: {
                user_id: userId,
                parentId: sectionID
            }
        })

        return(newFolder)
    }

    async moveTodotoSection (taskId, newSectionParentId, userId) {

        const newOrder = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, newSectionParentId)

        const editedItem = await this.itemsRepository.findByPk(taskId)

        const lastOrderPreviosSection = await this.getActualLastOrderForTodos(itemTypesIDS.todo, userId, editedItem.parent_id)


        await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: editedItem.dataValues.order,
            target: lastOrderPreviosSection - 1,//max order actually
            parentId: editedItem.dataValues.parent_id
        },
        type: QueryTypes.UPDATE
        })

        editedItem.parent_id = newSectionParentId;
        editedItem.order = newOrder
        await editedItem.save()

        return (editedItem)
    }

    async changeOrderSameGroup (sourceOrder, targetOrder, parentId){
        if(sourceOrder == targetOrder){
            throw new Error(boom.badData('The order should not be equal'));
        }
        if(sourceOrder < targetOrder){
            const data = await this.upward(sourceOrder, targetOrder, parentId)


            return (data)
        }
        if(sourceOrder > targetOrder){
            const data = await this.downward(sourceOrder, targetOrder, parentId)
            return (data)
        }
    }

    async upward (source, target, parentId) {

        const data = await this.itemsRepository.query(`
            UPDATE items
            SET \`order\` = CASE
                WHEN \`order\` BETWEEN :source + 1 AND :target THEN \`order\` - 1
                WHEN \`order\` = :source THEN :target
                ELSE \`order\`
            END
            WHERE \`order\` BETWEEN :source AND :target
                AND parent_id = :parentId;
        `,{
        replacements:{
            source: source,
            target: target,
            parentId: parentId
        },
        type: QueryTypes.UPDATE
        })
    return(data)
    }

    async downward (source, target, parentId) {
        const data = await this.itemsRepository.query(`
                UPDATE items
                SET \`order\` = CASE
                    WHEN \`order\` BETWEEN :target AND :source - 1 THEN \`order\` + 1
                    WHEN \`order\` = :source THEN :target
                    ELSE \`order\`
                END
                WHERE \`order\` BETWEEN :target AND :source
                    AND parent_id = :parentId;
            `,{
            replacements:{
                source: source,
                target: target,
                parentId: parentId
            },
            type: QueryTypes.UPDATE
            })
        return(data)
    }


}



module.exports = ItemsService;
