import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProfileToHistory1744290000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop unique constraint biar bisa One-to-Many (History)
        await queryRunner.query(`ALTER TABLE "user_body_profiles" DROP CONSTRAINT "REL_user_body_profiles_user_id"`);
        
        // Tambahin index biar query history per user tetep kenceng
        await queryRunner.query(`CREATE INDEX "IDX_user_body_profiles_user_id" ON "user_body_profiles" ("user_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_user_body_profiles_user_id"`);
        await queryRunner.query(`ALTER TABLE "user_body_profiles" ADD CONSTRAINT "REL_user_body_profiles_user_id" UNIQUE ("user_id")`);
    }
}
