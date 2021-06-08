import Faker from 'faker';
import { define } from 'typeorm-seeding';
import { User } from '@components/user/models/User';
import { createHashedPassword } from '@components/user/services';

// @ts-ignore
define(User, async (faker: typeof Faker) => {
  const user = new User();
  user.login = faker.name.findName();
  user.password = await createHashedPassword('password');

  return user;
});
