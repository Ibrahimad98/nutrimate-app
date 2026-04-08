import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeEmailNullable1743944700000 implements MigrationInterface {
  name = 'MakeEmailNullable1743944700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ALTER COLUMN "email" SET NOT NULL
    `);
  }
}
