const AuthService = require('../../services/business_services/auth.service');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secretKey } = require('../../configuration/config');

describe('AuthService', () => {
  let mockUserService;
  let mockItemService;
  let authService;

  const userBody = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    username: 'miUsuarioTest',
    email: 'usuario@test.com',
    password: 'unaContraseñaSinEncriptar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockedHash = 'contraseñaEncriptada';

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserService = {
      create: jest.fn(),
      getByUser: jest.fn(),
    };

    mockItemService = {
      createDefaultProjects: jest.fn(),
    };

    authService = new AuthService(mockItemService, mockUserService);

    mockUserService.create.mockResolvedValue({
      dataValues: {
        ...userBody,
        password: mockedHash,
      },
    });

    mockUserService.getByUser.mockResolvedValue({
      dataValues: {
        ...userBody,
        password: mockedHash,
      },
    });

    mockItemService.createDefaultProjects.mockResolvedValue(true);
  });
/*
  test('signIn should return user object without password and id', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHash);

    const res = await authService.signIn({
      username: userBody.username,
      email: userBody.email,
      password: userBody.password,
    });

    expect(res).toBeInstanceOf(Object);
    expect(res).not.toHaveProperty('password');
    expect(res).not.toHaveProperty('id');
    expect(mockUserService.create).toHaveBeenCalledTimes(1);
    expect(mockItemService.createDefaultProjects).toHaveBeenCalledTimes(1);
  }); */

  test('signIn should call create and createDefaultProjects', async () => {
    jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockedHash);

    await authService.signIn({
      username: userBody.username,
      email: userBody.email,
      password: userBody.password,
    });

    expect(mockUserService.create).toHaveBeenCalledTimes(1);
    expect(mockItemService.createDefaultProjects).toHaveBeenCalledTimes(1);
  });

  test('logIn should return a JWT token', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

    const token = await authService.logIn({
      username: userBody.username,
      password: userBody.password,
    });

    expect(mockUserService.getByUser).toHaveBeenCalledWith(userBody.username);
    expect(bcrypt.compare).toHaveBeenCalledWith(userBody.password, mockedHash);
    expect(jwt.sign).toHaveBeenCalledWith({
      userId: userBody.id,
      username: userBody.username,
      email: userBody.email,
    }, secretKey);
    expect(token).toBe('mockedToken');
  });
});
