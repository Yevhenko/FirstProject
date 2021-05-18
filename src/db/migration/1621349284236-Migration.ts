import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1621349284236 implements MigrationInterface {
    name = 'Migration1621349284236'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "sessionID"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "sessionID" character varying(100) NOT NULL`);
    }

}
