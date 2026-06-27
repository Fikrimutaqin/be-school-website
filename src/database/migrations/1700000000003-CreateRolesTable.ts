import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolesTable1700000000003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE roles (
          id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          name        VARCHAR(50) NOT NULL UNIQUE,
          slug        VARCHAR(50) NOT NULL UNIQUE,
          description TEXT,
          is_system   BOOLEAN     NOT NULL DEFAULT FALSE,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE roles IS 'Definisi peran dalam sistem RBAC';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN roles.is_system IS 'Peran bawaan sistem yang tidak boleh dihapus';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS roles CASCADE;`);
  }
}
