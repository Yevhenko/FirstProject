import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpecifyPost1621864451975 implements MigrationInterface {
  name = 'SpecifyPost1621864451975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "text" TO "textInPost"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "textInPost" TO "text"`);
  }
}
