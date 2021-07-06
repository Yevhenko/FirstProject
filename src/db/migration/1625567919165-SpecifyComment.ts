import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpecifyComment1625567919165 implements MigrationInterface {
  name = 'SpecifyComment1625567919165';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "title"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "comment" ADD "title" character varying(101) NOT NULL`);
  }
}
