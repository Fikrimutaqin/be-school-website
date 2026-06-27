import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
          id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          nik             VARCHAR(20) UNIQUE,
          email           VARCHAR(255) NOT NULL UNIQUE,
          password_hash   VARCHAR(255),
          full_name       VARCHAR(100) NOT NULL,
          phone           VARCHAR(20),
          avatar_url      TEXT,
          google_id       VARCHAR(100) UNIQUE,
          is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
          must_change_pw  BOOLEAN     NOT NULL DEFAULT FALSE,
          failed_attempts INT         NOT NULL DEFAULT 0,
          locked_until    TIMESTAMPTZ,
          last_login_at   TIMESTAMPTZ,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE users IS 'Seluruh pengguna sistem (admin, guru, siswa, orang tua)';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN users.nik IS 'NIP untuk guru/staf, NISN untuk siswa — opsional';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN users.must_change_pw IS 'TRUE = user wajib ubah password saat login pertama';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN users.locked_until IS 'Saat terisi, user tidak bisa login sampai waktu ini';`,
    );

    await queryRunner.query(`CREATE INDEX idx_users_email ON users(email);`);
    await queryRunner.query(`CREATE INDEX idx_users_nik ON users(nik);`);
    await queryRunner.query(
      `CREATE INDEX idx_users_is_active ON users(is_active);`,
    );

    await queryRunner.query(`
      CREATE TRIGGER trg_users_updated_at
          BEFORE UPDATE ON users
          FOR EACH ROW EXECUTE FUNCTION set_updated_at();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS trg_users_updated_at ON users;`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS users CASCADE;`);
  }
}
