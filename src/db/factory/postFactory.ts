import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '@components/user/models/User';
import { Post } from '@components/post/models/Post';

define(Post, (faker: typeof Faker, context: { user: User } | undefined) => {
  const post = new Post();
  post.title = faker.random.word();
  post.text = faker.random.words();
  post.user = context!.user;

  return post;
});
