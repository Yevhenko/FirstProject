import { Request, Response } from 'express';
import { createPost, getOnePost, getAllPosts, updatePost, deletePost } from '@components/post/controller';
import { postService } from '@components/post';

jest.mock('@components/post/service', () => {
  return {
    createPostInDb: jest.fn(),
    getAllPostsFromDb: jest.fn(),
    getPostById: jest.fn(),
    updatePostInDb: jest.fn(),
    deletePostFromDb: jest.fn(),
    getUserIdOfThePost: jest.fn(),
  };
});

describe('testing post controllers', () => {
  const query = { offset: 3, limit: 10 };
  const params = { id: 1 };
  const body = { title: 'someTitle', text: 'someText' };
  const mockPosts = [
    { id: 1, text: 'someText', title: 'someTitle', createdAt: 1624531802526, updatedAt: 1624531802526 },
    { id: 2, text: 'anyText', title: 'anyTitle', createdAt: 1624531802526, updatedAt: 1624531802526 },
  ];
  const expectedOutputOfPosts = [
    { id: 1, text: 'someText', title: 'someTitle' },
    { id: 2, text: 'anyText', title: 'anyTitle' },
  ];
  const post = {
    id: 1,
    title: 'someTitle',
    text: 'someText',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  describe.skip('getAllPosts', () => {
    it('success case', async () => {
      const mReq = { query };
      const mRes = { json: jest.fn() };

      (postService.getAllPostsFromDb as jest.MockedFunction<any>).mockResolvedValue(mockPosts);

      await getAllPosts(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.getAllPostsFromDb).toHaveBeenCalledWith(3, 10);
      expect(mRes.json).toHaveBeenCalledWith(expectedOutputOfPosts);
    });
  });

  describe.skip('createPost', () => {
    it('success case', async () => {
      const mReq = { body };
      const mRes = { json: jest.fn() };

      (postService.createPostInDb as jest.MockedFunction<any>).mockResolvedValue(post);
      await createPost(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.createPostInDb).toHaveBeenCalledWith({ title: post.title, text: post.text });
      expect(mRes.json).toHaveBeenCalledWith({ id: post.id, title: post.title, text: post.text });
    });
  });

  describe.skip('getPostById', () => {
    it('success case', async () => {
      const mReq = { params };
      const mRes = { json: jest.fn() };

      (postService.getPostById as jest.MockedFunction<any>).mockResolvedValue(post);

      await getOnePost(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.getPostById).toHaveBeenCalledWith(post.id);
      expect(mRes.json).toHaveBeenCalledWith(post);
    });
  });

  describe.skip('updatePost', () => {
    it('success case', async () => {
      const mReq = { body: { title: 'newTitle' }, params, user: { id: 1 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (postService.getUserIdOfThePost as jest.MockedFunction<any>).mockResolvedValue(1);
      (postService.updatePostInDb as jest.MockedFunction<any>).mockResolvedValue();
      await updatePost(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.getUserIdOfThePost).toHaveBeenCalledWith(post.id);
      expect(postService.updatePostInDb).toHaveBeenCalledWith(post.id, 'newTitle', undefined);
      expect(mRes.sendStatus).toHaveBeenCalledWith(200);
    });

    it('userId mismatch', async () => {
      const mReq = { body, params, user: { id: 2 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (postService.getUserIdOfThePost as jest.MockedFunction<any>).mockResolvedValue(1);
      (postService.updatePostInDb as jest.MockedFunction<any>).mockResolvedValue();
      await updatePost(mReq as unknown as Request, mRes as unknown as Response);

      expect(mRes.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe.skip('deletePost', () => {
    it('success case', async () => {
      const mReq = { body, params, user: { id: 1 } };
      const mRes = {
        sendStatus: jest.fn(),
      };

      (postService.getUserIdOfThePost as jest.MockedFunction<any>).mockResolvedValue(1);
      (postService.deletePostFromDb as jest.MockedFunction<any>).mockResolvedValue();
      await deletePost(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.getUserIdOfThePost).toHaveBeenCalledWith(post.id);
      expect(postService.deletePostFromDb).toHaveBeenCalledWith(post.id);
      expect(mRes.sendStatus).toHaveBeenCalledWith(200);
    });

    it('userId mismatch', async () => {
      const mReq = { body, params, user: { id: 2 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (postService.getUserIdOfThePost as jest.MockedFunction<any>).mockResolvedValue(1);
      (postService.deletePostFromDb as jest.MockedFunction<any>).mockResolvedValue();
      await updatePost(mReq as unknown as Request, mRes as unknown as Response);

      expect(mRes.sendStatus).toHaveBeenCalledWith(403);
    });
  });
});
