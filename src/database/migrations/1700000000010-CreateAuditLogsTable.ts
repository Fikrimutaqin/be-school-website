import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogsTable1700000000010 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE audit_logs (
          id           BIGSERIAL   PRIMARY KEY,
          user_id      UUID        REFERENCES users(id) ON DELETE SET NULL,
          session_id   UUID        REFERENCES sessions(id) ON DELETE SET NULL,
          action       VARCHAR(50) NOT NULL,
          module       VARCHAR(50) NOT NULL,
          target_id    UUID,
          target_type  VARCHAR(50),
          ip_address   INET,
          changes_json JSONB,
          description  TEXT,
          created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE audit_logs IS 'Rekam jejak lengkap semua aksi penting di sistem';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN audit_logs.changes_json IS 'Snapshot perubahan data: {before:{...}, after:{...}}';`,
    );

    await queryRunner.query(
      `CREATE INDEX idx_audit_user ON audit_logs(user_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_audit_module ON audit_logs(module);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_audit_time ON audit_logs(created_at DESC);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_logs CASCADE;`);
  }
}
