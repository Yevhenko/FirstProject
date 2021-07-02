export const createCommentInDb = async (): Promise<any> => {
  return {
    id: 1,
    text: 'anyText',
    postId: 1,
    userId: 1,
    createdAt: 1625235619486,
    updatedAt: 1625235619486,
  };
};

export const getCommentFromDb = async (id: number): Promise<any> => {
  return {
    id,
    text: 'anyText',
    postId: 1,
    userId: 1,
    createdAt: 1625235619486,
    updatedAt: 1625235619486,
  };
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
