import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePhoneNumberToPhone1743944600000 implements MigrationInterface {
  name = 'RenamePhoneNumberToPhone1743944600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename phone_number column to phone
    await queryRunner.query(`
      ALTER TABLE "users"
      RENAME COLUMN "phone_number" TO "phone"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
      RENAME COLUMN "phone" TO "phone_number"
    `);
  }
}
