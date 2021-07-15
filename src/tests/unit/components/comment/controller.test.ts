import { Request, Response } from 'express';
import { commentService } from '@components/comment';
import { postService } from '@components/post';
import {
  createComment,
  deleteComment,
  getAllComments,
  getOneComment,
  updateComment,
} from '@components/comment/controller';

jest.mock('@components/comment/service', () => {
  return {
    createCommentInDb: jest.fn(),
    getAllCommentsFromDb: jest.fn(),
    getCommentFromDb: jest.fn(),
    updateCommentInDb: jest.fn(),
    deleteCommentFromDb: jest.fn(),
    getUserIdOfTheComment: jest.fn(),
  };
});

jest.mock('@components/post/service', () => {
  return {
    getPostById: jest.fn(),
  };
});

describe.skip('testing comment controller', () => {
  const query = { offset: 1, limit: 1 };
  const params = { id: 1 };
  const body = { text: 'someText', postId: 1 };
  const mockComments = [
    { id: 1, text: 'someText', postId: 1 },
    { id: 2, text: 'anyText', postId: 1 },
  ];
  const expectedOutputOfComments = [
    { id: 1, text: 'someText', postId: 1 },
    { id: 2, text: 'anyText', postId: 1 },
  ];
  const comment = {
    id: 1,
    text: 'someText',
    postId: 1,
  };
  const post = {
    id: 1,
    title: 'someTitle',
    text: 'someText',
  };
  const user = {
    id: 1,
    login: 'someLogin',
    password: 'somePassword',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  describe('createComment', () => {
    it('success case', async () => {
      const mReq = { body, user };
      const mRes = { json: jest.fn() };

      (postService.getPostById as jest.MockedFunction<any>).mockResolvedValue(post);
      (commentService.createCommentInDb as jest.MockedFunction<any>).mockResolvedValue(comment);
      await createComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(postService.getPostById).toHaveBeenCalledWith(post.id);
      expect(commentService.createCommentInDb).toHaveBeenCalledWith({
        text: comment.text,
        post,
        user,
      });
      expect(mRes.json).toHaveBeenCalledWith({ id: comment.id, text: comment.text, postId: comment.postId });
    });
  });

  describe('getAllComments', () => {
    it('success case', async () => {
      const mReq = { query };
      const mRes = { json: jest.fn() };

      (commentService.getAllCommentsFromDb as jest.MockedFunction<any>).mockResolvedValue(mockComments);

      await getAllComments(mReq as unknown as Request, mRes as unknown as Response);

      expect(commentService.getAllCommentsFromDb).toHaveBeenCalledWith(1, 1);
      expect(mRes.json).toHaveBeenCalledWith(expectedOutputOfComments);
    });
  });

  describe('getCommentById', () => {
    it('success case', async () => {
      const mReq = { params };
      const mRes = { json: jest.fn() };

      (commentService.getCommentFromDb as jest.MockedFunction<any>).mockResolvedValue(comment);

      await getOneComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(commentService.getCommentFromDb).toHaveBeenCalledWith(comment.id);
      expect(mRes.json).toHaveBeenCalledWith(comment);
    });
  });

  describe('updateComment', () => {
    it('success case', async () => {
      const mReq = { body: { text: 'newText' }, params, user: { id: 1 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (commentService.getUserIdOfTheComment as jest.MockedFunction<any>).mockResolvedValue(1);
      (commentService.updateCommentInDb as jest.MockedFunction<any>).mockResolvedValue();
      await updateComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(commentService.getUserIdOfTheComment).toHaveBeenCalledWith(comment.id);
      expect(commentService.updateCommentInDb).toHaveBeenCalledWith(comment.id, 'newText');
      expect(mRes.sendStatus).toHaveBeenCalledWith(200);
    });

    it('userId mismatch', async () => {
      const mReq = { body, params, user: { id: 2 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (commentService.getUserIdOfTheComment as jest.MockedFunction<any>).mockResolvedValue(1);
      (commentService.updateCommentInDb as jest.MockedFunction<any>).mockResolvedValue();
      await updateComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(mRes.sendStatus).toHaveBeenCalledWith(403);
    });
  });

  describe('deleteComment', () => {
    it('success case', async () => {
      const mReq = { body, params, user: { id: 1 } };
      const mRes = {
        sendStatus: jest.fn(),
      };

      (commentService.getUserIdOfTheComment as jest.MockedFunction<any>).mockResolvedValue(1);
      (commentService.deleteCommentFromDb as jest.MockedFunction<any>).mockResolvedValue();
      await deleteComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(commentService.getUserIdOfTheComment).toHaveBeenCalledWith(comment.id);
      expect(commentService.deleteCommentFromDb).toHaveBeenCalledWith(comment.id);
      expect(mRes.sendStatus).toHaveBeenCalledWith(200);
    });

    it('userId mismatch', async () => {
      const mReq = { body, params, user: { id: 2 } };
      const mRes = {
        sendStatus: jest.fn(),
      };
      (commentService.deleteCommentFromDb as jest.MockedFunction<any>).mockResolvedValue();
      (commentService.getUserIdOfTheComment as jest.MockedFunction<any>).mockResolvedValue(1);
      await deleteComment(mReq as unknown as Request, mRes as unknown as Response);

      expect(mRes.sendStatus).toHaveBeenCalledWith(403);
    });
  });
});
