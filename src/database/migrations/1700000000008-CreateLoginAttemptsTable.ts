import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateLoginAttemptsTable1700000000008 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE login_attempts (
          id             BIGSERIAL   PRIMARY KEY,
          identifier     VARCHAR(255) NOT NULL,
          ip_address     INET,
          is_success     BOOLEAN     NOT NULL DEFAULT FALSE,
          failure_reason VARCHAR(50),
          attempted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE login_attempts IS 'Log semua percobaan login untuk deteksi brute-force';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN login_attempts.failure_reason IS 'Kode penyebab gagal: wrong_password, user_not_found, account_locked, account_inactive';`,
    );

    await queryRunner.query(
      `CREATE INDEX idx_login_identifier ON login_attempts(identifier);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_login_ip ON login_attempts(ip_address);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_login_time ON login_attempts(attempted_at DESC);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS login_attempts CASCADE;`);
  }
}
