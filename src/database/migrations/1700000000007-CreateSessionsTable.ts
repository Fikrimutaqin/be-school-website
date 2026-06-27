import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSessionsTable1700000000007 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE sessions (
          id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash   VARCHAR(255) NOT NULL UNIQUE,
          ip_address   INET,
          user_agent   TEXT,
          role_used_id UUID        REFERENCES roles(id) ON DELETE SET NULL,
          is_revoked   BOOLEAN     NOT NULL DEFAULT FALSE,
          expires_at   TIMESTAMPTZ NOT NULL,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE sessions IS 'Sesi login aktif dan refresh token';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN sessions.token_hash IS 'SHA-256 hash dari refresh token, bukan token asli';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN sessions.role_used_id IS 'Peran yang dipilih pengguna saat login (jika punya multi-role)';`,
    );

    await queryRunner.query(
      `CREATE INDEX idx_sessions_user ON sessions(user_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_sessions_token ON sessions(token_hash);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_sessions_expires ON sessions(expires_at);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS sessions CASCADE;`);
  }
}
