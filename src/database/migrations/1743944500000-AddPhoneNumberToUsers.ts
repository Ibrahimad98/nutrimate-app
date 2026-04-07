import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPhoneNumberToUsers1743944500000 implements MigrationInterface {
  name = 'AddPhoneNumberToUsers1743944500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN IF NOT EXISTS "phone_number" VARCHAR UNIQUE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN IF EXISTS "phone_number"
    `);
  }
}
