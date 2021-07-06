import { Request, Response } from 'express';
import { getAllUsers } from '@components/user/controller';
import { userService } from '@components/user';

jest.mock('@components/user/services', () => {
  return {
    getUsersFromDb: jest.fn(),
  };
});

describe.skip('testing user controllers', () => {
  const query = { offset: 1, limit: 1 };
  const mockUsers = [
    { id: 1, login: 'someLogin', password: 'somePassword', createdAt: 1624531802526, updatedAt: 1624531802526 },
    { id: 2, login: 'someLogin', password: 'somePassword', createdAt: 1624531802526, updatedAt: 1624531802526 },
  ];
  const expected = [
    { id: 1, login: 'someLogin' },
    { id: 2, login: 'someLogin' },
  ];

  describe('getAllUsers', () => {
    it('success case', async () => {
      const mReq = { query };
      const mRes = { json: jest.fn() };

      (userService.getUsersFromDb as jest.MockedFunction<any>).mockResolvedValue(mockUsers);

      await getAllUsers(mReq as unknown as Request, mRes as unknown as Response);

      expect(userService.getUsersFromDb).toHaveBeenCalledWith(1, 1);
      expect(mRes.json).toHaveBeenCalledWith(expected);
    });
  });
});
