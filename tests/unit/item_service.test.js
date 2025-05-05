const ItemsService = require('../../services/data_services/items.service');
const boom = require('@hapi/boom');


describe('ItemsService', () => {
    let itemsRepositoryMock;
    let itemsService;

    beforeEach(() => {
      itemsRepositoryMock = {
        findAll: jest.fn(),
      };
      itemsService = new ItemsService(itemsRepositoryMock);
    });

    it('should get items successfully', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockFolders = [{ id: 'folder1' }, { id: 'folder2' }];
      const mockSections = [{ id: 'section1' }, { id: 'section2' }];
      const mockTodos = [{ id: 'todo1' }, { id: 'todo2' }];
      const mockChecklists = [{ id: 'checklist1' }, { id: 'checklist2' }];

      itemsRepositoryMock.findAll
        .mockResolvedValueOnce(mockFolders) // folders
        .mockResolvedValueOnce(mockSections) // sections
        .mockResolvedValueOnce(mockTodos) // todos
        .mockResolvedValueOnce(mockChecklists); // checklists

      const result = await itemsService.getItems(userId);

      expect(itemsRepositoryMock.findAll).toHaveBeenCalledTimes(4);
      expect(itemsRepositoryMock.findAll).toHaveBeenNthCalledWith(1, {
        where: { user_id: userId, parent_id: null, type_id: 3 },
        order: [['order', 'ASC']],
      });
      expect(itemsRepositoryMock.findAll).toHaveBeenNthCalledWith(2, {
        where: { user_id: userId, type_id: 2 },
        order: [['order', 'ASC']],
      });
      expect(itemsRepositoryMock.findAll).toHaveBeenNthCalledWith(3, {
        where: { user_id: userId, type_id: 1, special_type_id: null },
        order: [['order', 'ASC']],
      });
      expect(itemsRepositoryMock.findAll).toHaveBeenNthCalledWith(4, {
        where: { user_id: userId, type_id: 1, special_type_id: 1 },
        order: [['order', 'ASC']],
      });

      expect(result).toEqual({
        folders: mockFolders,
        sections: mockSections,
        todos: mockTodos,
        checklists: mockChecklists,
      });
    });

    it('should handle errors and throw boom.internal', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';

      const error = new Error();

      itemsRepositoryMock.findAll.mockRejectedValue(error);

      await expect(itemsService.getItems(userId)).rejects.toThrow(
        'Internal error'
      );
    });
  });
