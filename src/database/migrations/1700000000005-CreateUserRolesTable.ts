import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserRolesTable1700000000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE user_roles (
          id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          role_id     UUID        NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
          assigned_by UUID        REFERENCES users(id) ON DELETE SET NULL,
          scope_type  VARCHAR(30),
          scope_id    UUID,
          assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          expires_at  TIMESTAMPTZ,
          UNIQUE (user_id, role_id, scope_type, scope_id)
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE user_roles IS 'Penetapan peran ke pengguna, bisa dibatasi per scope';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN user_roles.scope_type IS 'Jenis scope: NULL (global), kelas, jurusan, angkatan';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN user_roles.scope_id IS 'UUID entitas scope (misal: id kelas)';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN user_roles.expires_at IS 'Untuk peran sementara, misal wali kelas satu tahun ajaran';`,
    );

    await queryRunner.query(
      `CREATE INDEX idx_user_roles_user ON user_roles(user_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_user_roles_role ON user_roles(role_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS user_roles CASCADE;`);
  }
}
