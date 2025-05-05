const AuthService = require('../../services/business_services/auth.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {secretKey} = require('../../configuration/config')

describe('Auth-Service', () => {
    let mockUserService = {
        create: jest.fn(),
        getByUser: jest.fn(),
    };
    let mockItemService = {
        createInbox: jest.fn(),
    };

    const userBody = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        username: 'miUsuarioTest',
        email: 'usuario@test.com',
        password: 'unaContraseñaSinEncriptar',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    const mockedHash = 'contraseñaEncriptada';

    let authService = new AuthService(mockItemService, mockUserService);

    let userServiceCreateSpy;
    let itemServiceCreateInboxSpy;
    let userServiceGetByUserSpy;

    beforeEach(() => {
        // Restablece el estado de los mocks antes de cada test
        jest.clearAllMocks();



        userServiceCreateSpy = jest.spyOn(mockUserService, 'create').mockResolvedValue({
            dataValues: {
                ...userBody,
                password: mockedHash,
            },
        });

        userServiceGetByUserSpy = jest.spyOn(mockUserService, 'getByUser').mockResolvedValue({
            dataValues: {
                ...userBody,
                password: mockedHash,
            },
        });

        const data = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            item_name: 'INBOX',
            description: null,
            parent_id: null,
            order: 0,
            user_id: '123e4567-e89b-12d3-a456-426614174000',
            type_id: 3,
            is_favorite: 0,
            status: 'pending',
            special_type_id: 3,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        }

        itemServiceCreateInboxSpy = jest.spyOn(mockItemService, 'createInbox').mockResolvedValue({
            dataValues: data
        });
    });

    test('Sing-in return object without password and id value', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHash);

        const res = await authService.signIn({
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
        });

        expect(res).toBeInstanceOf(Object);
        expect(res).not.toHaveProperty('password');
        expect(res).not.toHaveProperty('id');
    });

    test('Sing-in The funcitions createInbox and createUser have been called', async () => {
        await authService.signIn({
            username: userBody.username,
            email: userBody.email,
            password: userBody.password,
        });

        expect(userServiceCreateSpy).toHaveBeenCalledTimes(1);
        expect(itemServiceCreateInboxSpy).toHaveBeenCalledTimes(1);
    });

    test('Log-In return a token on login', async () => {
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
        jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

        const expectedPayload = {
            userId: userBody.id,
            username: userBody.username,
            email: userBody.email
        }

        const token = await authService.logIn({
            username: userBody.username,
            password: userBody.password
        });

        expect(userServiceGetByUserSpy).toHaveBeenCalledWith(userBody.username);
        expect(bcrypt.compare).toHaveBeenCalledWith(userBody.password, mockedHash);
        expect(jwt.sign).toHaveBeenCalledWith( expectedPayload, secretKey)
        expect(token).toBe('mockedToken');
    })
});
