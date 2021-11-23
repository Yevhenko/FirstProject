import { EntityRepository } from 'typeorm';
import { AbstractPolymorphicRepository } from 'typeorm-polymorphic';

@EntityRepository(AdvertEntity)
export class LikeRepository extends AbstractPolymorphicRepository<Like> {}
