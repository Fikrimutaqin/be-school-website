import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePasswordResetsTable1700000000009 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE password_resets (
          id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          token_hash  VARCHAR(255) NOT NULL UNIQUE,
          is_used     BOOLEAN     NOT NULL DEFAULT FALSE,
          expires_at  TIMESTAMPTZ NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE password_resets IS 'Token untuk alur lupa / reset kata sandi';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN password_resets.token_hash IS 'Hash token yang dikirim ke email, bukan token asli';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS password_resets CASCADE;`);
  }
}
