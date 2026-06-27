import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1700000001004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (id, email, password_hash, full_name, is_active, must_change_pw) VALUES
          (
              'aaaaaaaa-0000-0000-0000-000000000001',
              'admin@sekolah.sch.id',
              '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCgMlGbXNxn26p.rBXsH0dK',
              'Administrator Sistem',
              TRUE,
              TRUE
          )
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE id = 'aaaaaaaa-0000-0000-0000-000000000001';`,
    );
  }
}
