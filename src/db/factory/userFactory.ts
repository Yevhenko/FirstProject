import Faker from 'faker';
import { User } from '@components/user/models/User';
import { define } from 'typeorm-seeding';

define(User, (faker: typeof Faker) => {
  const user = new User();
  user.login = faker.name.findName();
  user.password = faker.random.word();

  return user;
});
