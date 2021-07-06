import { getRepository } from 'typeorm';
import typeorm = require('typeorm');
import { Comment, commentService } from '@components/comment';

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
      getOne: jest.fn(),
      getMany: jest.fn(),
      delete: jest.fn(),
      merge: jest.fn(),
      where: jest.fn(),
      select: jest.fn(),
      execute: jest.fn(),
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

describe('testing services of the Comment', () => {
  const mockRepo = getRepository as jest.MockedFunction<any>;

  const mockComment = { id: 1, text: 'someText' };

  const mockUser = {
    id: 1,
    login: 'someLogin',
    password: 'somePassword',
    createdAt: 1624531802526,
    updatedAt: 1624531802526,
  };
  const mockPost = {
    id: 1,
    title: 'someTitle',
    text: 'someText',
    createdAt: 1624531802526,
    updatedAt: 1624531802526,
  };

  const mockData = { id: 1, text: 'someText', user: mockUser, post: mockPost };

  describe('testing creation Comment', () => {
    it('should succeed', async () => {
      mockRepo.mockReturnValue({
        create: jest.fn(jest.fn().mockResolvedValue(mockComment)),
        save: jest.fn().mockResolvedValue(mockComment),
      });

      // @ts-ignore
      await commentService.createCommentInDb(mockData);

      expect(getRepository(Comment).create).toHaveBeenCalledWith(mockData);
      expect(getRepository(Comment).save).toHaveBeenCalledWith(mockComment);
    });
  });

  describe('testing getting Comment', () => {
    it('should succeed', async () => {
      typeorm.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnThis(),
      });

      await commentService.getCommentFromDb(mockData.id);

      const qBuilder = typeorm.createQueryBuilder();

      expect(qBuilder.select).toHaveBeenNthCalledWith(1, ['comment']);
      expect(qBuilder.from).toHaveBeenNthCalledWith(1, Comment, 'comment');
      expect(qBuilder.where).toHaveBeenNthCalledWith(1, 'comment.id = :id', { id: mockData.id });
      expect(qBuilder.getOne).toHaveBeenCalled();
    });
  });
});
