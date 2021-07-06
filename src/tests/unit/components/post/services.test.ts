import { getRepository } from 'typeorm';
import typeorm = require('typeorm');
import { Post, postService } from '@components/post';

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

describe.skip('testing services', () => {
  const mockUser = {
    id: 1,
    login: 'someLogin',
    password: 'somePassword',
  };

  const mockData = {
    title: 'someTitle',
    text: 'someText',
    user: mockUser,
  };

  const mockPost = {
    id: 1,
    title: 'someTitle',
    text: 'someText',
  };

  describe('testing createPost', () => {
    it('post created', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        create: jest.fn().mockResolvedValue(mockPost),
        save: jest.fn().mockResolvedValue(mockPost),
      });

      // @ts-ignore
      await postService.createPostInDb(mockData);

      expect(getRepository(Post).create).toHaveBeenCalledWith(mockData);
      expect(getRepository(Post).save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('testing deletePost', () => {
    it('post deleted', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        delete: jest.fn().mockResolvedValue(mockPost),
      });

      await postService.deletePostFromDb(mockPost.id);

      expect(getRepository(Post).delete).toHaveBeenCalledWith(mockPost.id);
    });
  });

  describe('testing updatePost', () => {
    it('post updated', async () => {
      (getRepository as jest.MockedFunction<any>).mockReturnValue({
        merge: jest.fn().mockResolvedValue(mockPost),
        findOne: jest.fn().mockResolvedValue(mockPost),
        save: jest.fn().mockResolvedValue(mockPost),
      });

      await postService.updatePostInDb(mockPost.id, mockData.title, mockData.text);

      expect(getRepository(Post).findOne).toHaveBeenCalledWith({ where: { id: mockPost.id } });
      expect(getRepository(Post).merge).toHaveBeenCalledWith(mockPost, {
        text: mockData.text,
        title: mockData.title,
      });
      expect(getRepository(Post).save).toHaveBeenCalledWith(mockPost);
    });
  });

  describe('testing getPostById', () => {
    it('post has been got', async () => {
      typeorm.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockReturnThis(),
      });

      await postService.getPostById(mockPost.id);

      const qBuilder = typeorm.createQueryBuilder();

      expect(qBuilder.select).toHaveBeenNthCalledWith(1, ['post']);
      expect(qBuilder.from).toHaveBeenNthCalledWith(1, Post, 'post');
      expect(qBuilder.where).toHaveBeenNthCalledWith(1, 'post.id = :id', { id: mockPost.id });
      expect(qBuilder.getOne).toHaveBeenCalled();
    });
  });
});
