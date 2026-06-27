import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRolePermissionsTable1700000000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE role_permissions (
          id              UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
          role_id         UUID        NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
          permission_id   UUID        NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
          granted         BOOLEAN     NOT NULL DEFAULT TRUE,
          constraint_json JSONB,
          created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          UNIQUE (role_id, permission_id)
      );
    `);

    await queryRunner.query(
      `COMMENT ON TABLE role_permissions IS 'Pemetaan izin ke peran dengan aturan constraint opsional';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN role_permissions.granted IS 'FALSE = izin secara eksplisit dicabut (deny)';`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN role_permissions.constraint_json IS 'Aturan scope akses, misal: {"scope":"own_class"}';`,
    );

    await queryRunner.query(
      `CREATE INDEX idx_rp_role ON role_permissions(role_id);`,
    );
    await queryRunner.query(
      `CREATE INDEX idx_rp_permission ON role_permissions(permission_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS role_permissions CASCADE;`);
  }
}
