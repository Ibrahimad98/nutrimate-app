import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1743944400000 implements MigrationInterface {
  name = 'InitialSchema1743944400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create uuid-ossp extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users role enum
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'user')`,
    );

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"          UUID NOT NULL DEFAULT uuid_generate_v4(),
        "email"       VARCHAR NOT NULL,
        "password"    VARCHAR NOT NULL,
        "name"        VARCHAR NOT NULL,
        "role"        "public"."users_role_enum" NOT NULL DEFAULT 'user',
        "isActive"    BOOLEAN NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // Create user_body_profiles gender enum
    await queryRunner.query(
      `CREATE TYPE "public"."user_body_profiles_gender_enum" AS ENUM('male', 'female')`,
    );

    // Create user_body_profiles activity_level enum
    await queryRunner.query(
      `CREATE TYPE "public"."user_body_profiles_activity_level_enum" AS ENUM('sedentary', 'light', 'moderate', 'active', 'very_active')`,
    );

    // Create user_body_profiles table
    await queryRunner.query(`
      CREATE TABLE "user_body_profiles" (
        "id"             UUID NOT NULL DEFAULT uuid_generate_v4(),
        "user_id"        UUID NOT NULL,
        "height_cm"      NUMERIC(5,2) NOT NULL,
        "weight_kg"      NUMERIC(5,2) NOT NULL,
        "date_of_birth"  DATE NOT NULL,
        "gender"         "public"."user_body_profiles_gender_enum" NOT NULL,
        "activity_level" "public"."user_body_profiles_activity_level_enum" NOT NULL,
        "created_at"     TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "REL_user_body_profiles_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_user_body_profiles" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key
    await queryRunner.query(`
      ALTER TABLE "user_body_profiles"
        ADD CONSTRAINT "FK_user_body_profiles_user_id"
        FOREIGN KEY ("user_id")
        REFERENCES "users"("id")
        ON DELETE CASCADE
        ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_body_profiles" DROP CONSTRAINT "FK_user_body_profiles_user_id"`,
    );
    await queryRunner.query(`DROP TABLE "user_body_profiles"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_body_profiles_activity_level_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_body_profiles_gender_enum"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
