import { User } from '@components/user/models/User';
import { Post } from '@components/post/models/Post';
import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';

export class CreatePost implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const user = await factory(User)().createMany(20);
    await factory(Post)({ user }).createMany(80);
  }
}
