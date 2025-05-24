const ItemsService = require('../../services/data_services/items.service');
const boom = require('@hapi/boom');

describe('ItemsService', () => {
  let itemsRepositoryMock;
  let colorsRepositoryMock;
  let itemsService;

  beforeEach(() => {
    itemsRepositoryMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
    colorsRepositoryMock = {
      findAll: jest.fn(),
    };
    itemsService = new ItemsService(itemsRepositoryMock, colorsRepositoryMock);
  });

  it('should get items successfully', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';

    const mockFolders = [{ id: 'folder1' }];
    const mockSections = [{ id: 'section1' }];
    const mockTodos = [{ id: 'todo1' }];
    const mockSubTodos = [{ id: 'subTodo1' }];
    const mockInbox = { id: 'inbox1' };
    const mockSpecialProjects = [{ id: 'special1' }];
    const mockUnsections = [{ id: 'unsection1' }];
    const mockColors = [{ id: 'color1' }];

    // Mocks para las llamadas
    itemsRepositoryMock.findAll
      .mockResolvedValueOnce(mockFolders)         // folders
      .mockResolvedValueOnce(mockSections)        // sections
      .mockResolvedValueOnce(mockTodos)           // todos
      .mockResolvedValueOnce(mockSubTodos)        // subTodos
      .mockResolvedValueOnce(mockSpecialProjects) // specialProjects
      .mockResolvedValueOnce(mockUnsections);     // unsections

    itemsRepositoryMock.findOne.mockResolvedValueOnce(mockInbox);

    colorsRepositoryMock.findAll.mockResolvedValueOnce(mockColors);

    const result = await itemsService.getItems(userId);

    expect(itemsRepositoryMock.findAll).toHaveBeenCalledTimes(6);
    expect(itemsRepositoryMock.findOne).toHaveBeenCalledTimes(1);
    expect(colorsRepositoryMock.findAll).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      folders: mockFolders,
      sections: mockSections,
      todos: mockTodos,
      subTodos: mockSubTodos,
      inbox: mockInbox,
      specialProjects: mockSpecialProjects,
      unsections: mockUnsections,
      colors: mockColors,
    });
  });

  it('should handle errors and throw boom.internal', async () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const error = new Error('Database failure');

    itemsRepositoryMock.findAll.mockRejectedValue(error);

    await expect(itemsService.getItems(userId)).rejects.toThrow('Internal error');
  });
});
