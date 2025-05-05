const UserService = require('../../services/data_services/users.service')
const boom = require('@hapi/boom')


describe('User Service', () => {
    const mockUserRepo = {
        findOne: jest.fn(),
        create: jest.fn()
    }

    const userService = new UserService(mockUserRepo);

    test('should throw boom.badRequest when user does not exist', async () => {
        const nonExistentUsername = 'nonExistentUser';
        mockUserRepo.findOne.mockResolvedValue(null);

        await expect(userService.getByUser(nonExistentUsername)).rejects.toThrow(boom.badRequest('Incorrect User'));
    });

    test('should return user when user exists', async () => {
        const existingUsername = 'existingUser';
        const mockUser = {
            id: 1,
            username: existingUsername };

        mockUserRepo.findOne.mockResolvedValue(mockUser);
        const res = await userService.getByUser(existingUsername);

        expect(res).toEqual(mockUser);
    });

    test('should call create userRepository', async ()=>{
        const user = {
            username: 'test',
            email: 'test@mail.com'}
        await userService.create(user);
        expect(mockUserRepo.create).toHaveBeenCalledWith(user);
    })
})
