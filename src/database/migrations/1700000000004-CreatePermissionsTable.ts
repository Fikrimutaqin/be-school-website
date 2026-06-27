import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePermissionsTable1700000000004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE permissions (
          id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          module      VARCHAR(50) NOT NULL,
          action      VARCHAR(30) NOT NULL,
          slug        VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE permissions IS 'Daftar izin atomik per modul dan aksi';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN permissions.slug IS 'Format: {module}:{sub}:{action}, contoh: akademik:nilai:update';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN permissions.module IS 'Grup modul: pengguna, akademik, presensi, konten, keuangan, sistem';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS permissions CASCADE;`);
  }
}
