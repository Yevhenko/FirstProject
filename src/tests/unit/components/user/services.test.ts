import { getRepository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import typeorm = require('typeorm');
import { env } from '@config/config';
import { User, userService } from '@components/user';
import { createHashedPassword } from '@components/user/services';

jest.mock('typeorm', () => {
  return {
    createQueryBuilder: jest.fn(),
    getRepository: jest.fn().mockReturnValue({
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      skip: jest.fn(),
      take: jest.fn(),
      getMany: jest.fn(),
    }),
    PrimaryGeneratedColumn: jest.fn(),
    Column: jest.fn(),
    Entity: jest.fn(),
    CreateDateColumn: jest.fn(),
    UpdateDateColumn: jest.fn(),
    OneToMany: jest.fn(),
    ManyToOne: jest.fn(),
    JoinColumn: jest.fn(),
  };
});

jest.mock('bcrypt', () => {
  return {
    hash: jest.fn(),
    compare: jest.fn(),
  };
});

describe.skip('testing services', () => {
  const mockData = {
    login: 'someLogin',
    password: 'somePassword',
  };

  const mockUser = {
    id: 1,
    login: 'someLogin',
    password: 'somePassword',
  };

  describe('testing createUser', () => {
    it('user created', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        create: jest.fn().mockResolvedValue(mockUser),
        save: jest.fn().mockResolvedValue(mockUser),
      });

      await userService.createUser(mockData);

      expect(getRepository(User).create).toHaveBeenCalledWith(mockData);
      expect(getRepository(User).save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('testing getUserByLogin', () => {
    it('user has been got', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.getUserByLogin(mockData.login);

      expect(getRepository(User).findOne).toHaveBeenCalledWith({ where: { login: mockData.login } });
      expect(result).toEqual(mockUser);
    });

    it('no user', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(undefined),
      });

      const result = await userService.getUserByLogin(mockData.login);

      expect(getRepository(User).findOne).toHaveBeenCalledWith({ where: { login: mockData.login } });
      expect(result).toEqual(undefined);
    });
  });

  describe('testing getUserByLogin', () => {
    it('user has been got', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        findOne: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await userService.getUserByIdFromDb(mockUser.id);

      expect(getRepository(User).findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });
  });

  describe('hashingPassword', () => {
    it('hashPassword', async () => {
      (hash as jest.MockedFunction<any>).mockReturnThis();

      await userService.createHashedPassword(mockUser.password);

      expect(hash).toHaveBeenCalledWith(mockUser.password, env.SALT);
    });
  });

  describe('comparing hashed passwords', () => {
    it('compare', async () => {
      const pass = await createHashedPassword(mockUser.password);
      (compare as jest.MockedFunction<any>).mockReturnThis();

      const result = await userService.compareHashedPasswords(mockUser.password, pass);

      expect(compare).toHaveBeenCalledWith(mockUser.password, pass);
      expect(result).toBeTruthy();
    });
  });

  describe('getting users from db', () => {
    it('users have been got', async () => {
      const offset = 1;
      const limit = 2;

      typeorm.createQueryBuilder = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnThis(),
      });

      await userService.getUsersFromDb(offset, limit);

      const qBuilder = typeorm.createQueryBuilder();

      expect(qBuilder.from).toHaveBeenNthCalledWith(1, User, 'user');
      expect(qBuilder.skip).toHaveBeenCalledWith(1);
      expect(qBuilder.take).toHaveBeenCalledWith(limit);
      expect(qBuilder.getMany).toHaveBeenCalled();
    });
  });
});
