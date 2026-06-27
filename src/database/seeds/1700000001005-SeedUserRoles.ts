import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUserRoles1700000001005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES
          (
              'aaaaaaaa-0000-0000-0000-000000000001',
              '11111111-0000-0000-0000-000000000001',
              'aaaaaaaa-0000-0000-0000-000000000001'
          )
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM user_roles 
      WHERE user_id = 'aaaaaaaa-0000-0000-0000-000000000001' 
        AND role_id = '11111111-0000-0000-0000-000000000001';
    `);
  }
}
