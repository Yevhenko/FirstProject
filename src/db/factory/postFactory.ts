import Faker from 'faker';
import { User } from '@components/user/models/User';
import { Post } from '@components/post/models/Post';
import { define } from 'typeorm-seeding';

define(Post, (faker: typeof Faker, context: { user: User } | undefined) => {
  const post = new Post();
  post.title = faker.random.word();
  post.text = faker.random.words();
  post.user = context!.user;

  return post;
});
