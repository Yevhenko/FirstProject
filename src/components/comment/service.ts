import { createQueryBuilder, getRepository } from 'typeorm';
import { Comment } from '@components/comment/models/Comment';
import { IComment } from './interfaces';

export const createCommentInDb = async (data: IComment): Promise<IComment> => {
  const comRepo = getRepository(Comment);
  const comment = await comRepo.create(data);

  return await comRepo.save(comment);
};

export const getCommentFromDb = async (id: number): Promise<Comment | undefined> => {
  return await createQueryBuilder()
    .select(['comment'])
    .from(Comment, 'comment')
    .where('comment.id = :id', { id })
    .getOne();
};

export const getAllCommentsFromDb = async (): Promise<any> => {
  return [
    {
      id: 1,
      text: 'anyText',
      postId: 1,
      userId: 1,
      createdAt: 1625235619486,
      updatedAt: 1625235619486,
    },
    {
      id: 2,
      text: 'oneMoreText',
      postId: 1,
      userId: 1,
      createdAt: 1625235619486,
      updatedAt: 1625235619486,
    },
  ];
};

export const updateCommentInDb = async (id: number, text: string): Promise<any> => {
  return {
    id,
    text,
    postId: 1,
    userId: 1,
    createdAt: 1625235619486,
    updatedAt: 1625235619486,
  };
};

export const deleteComment = async (id: number): Promise<any> => {
  return `post with ${id} deleted`;
};
