import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateViewsAndRbacFunctions1700000000011 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION user_has_permission(
          p_user_id   UUID,
          p_slug      VARCHAR
      ) RETURNS BOOLEAN AS $$
      DECLARE
          v_count INT;
      BEGIN
          SELECT COUNT(*) INTO v_count
          FROM user_roles ur
          JOIN role_permissions rp ON rp.role_id = ur.role_id
          JOIN permissions p ON p.id = rp.permission_id
          WHERE ur.user_id = p_user_id
            AND p.slug = p_slug
            AND rp.granted = TRUE
            AND (ur.expires_at IS NULL OR ur.expires_at > NOW());

          RETURN v_count > 0;
      END;
      $$ LANGUAGE plpgsql STABLE;
    `);

    await queryRunner.query(
      `COMMENT ON FUNCTION user_has_permission IS 'Cek apakah user memiliki permission slug tertentu melalui role yang aktif';`,
    );

    await queryRunner.query(`
      CREATE OR REPLACE VIEW user_effective_permissions AS
      SELECT
          u.id            AS user_id,
          u.email,
          r.slug          AS role_slug,
          r.name          AS role_name,
          p.slug          AS permission_slug,
          p.module,
          p.action,
          rp.granted,
          rp.constraint_json,
          ur.scope_type,
          ur.scope_id,
          ur.expires_at   AS role_expires_at
      FROM users u
      JOIN user_roles       ur ON ur.user_id = u.id
      JOIN roles            r  ON r.id = ur.role_id
      JOIN role_permissions rp ON rp.role_id = r.id
      JOIN permissions      p  ON p.id = rp.permission_id
      WHERE u.is_active = TRUE
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW());
    `);

    await queryRunner.query(
      `COMMENT ON VIEW user_effective_permissions IS 'View gabungan untuk melihat seluruh izin efektif per pengguna';`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP VIEW IF EXISTS user_effective_permissions CASCADE;`,
    );
    await queryRunner.query(
      `DROP FUNCTION IF EXISTS user_has_permission CASCADE;`,
    );
  }
}
