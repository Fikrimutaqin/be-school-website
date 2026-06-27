import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRolePermissions1700000001003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ADMIN permissions
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id, granted)
      SELECT
          '11111111-0000-0000-0000-000000000001',
          id,
          TRUE
      FROM permissions
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);

    // GURU permissions
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id, granted, constraint_json)
      SELECT
          '11111111-0000-0000-0000-000000000002' AS role_id,
          p.id,
          TRUE,
          c.constraint_json::jsonb
      FROM (VALUES
          ('akademik:nilai:create',       '{"scope":"own_subject"}'),
          ('akademik:nilai:read',         '{"scope":"own_class"}'),
          ('akademik:nilai:update',       '{"scope":"own_subject"}'),
          ('akademik:nilai:export',       '{"scope":"own_class"}'),
          ('akademik:jadwal:read',        NULL),
          ('akademik:kurikulum:read',     NULL),
          ('presensi:create',             '{"scope":"own_class"}'),
          ('presensi:read',               '{"scope":"own_class"}'),
          ('presensi:update',             '{"scope":"own_class"}'),
          ('presensi:export',             '{"scope":"own_class"}'),
          ('presensi:izin:read',          '{"scope":"own_class"}'),
          ('presensi:izin:approve',       '{"scope":"own_class"}'),
          ('konten:pengumuman:create',    '{"scope":"own_class"}'),
          ('konten:pengumuman:read',      NULL),
          ('konten:pengumuman:update',    '{"scope":"own"}'),
          ('konten:materi:create',        NULL),
          ('konten:materi:read',          NULL),
          ('konten:materi:delete',        '{"scope":"own"}'),
          ('pesan:create',                '{"scope":"to_students_parents"}'),
          ('pesan:read',                  NULL),
          ('laporan:akademik:read',       '{"scope":"own_class"}'),
          ('laporan:akademik:export',     '{"scope":"own_class"}')
      ) AS c(slug, constraint_json)
      JOIN permissions p ON p.slug = c.slug
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);

    // SISWA permissions
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id, granted, constraint_json)
      SELECT
          '11111111-0000-0000-0000-000000000003',
          p.id,
          TRUE,
          c.constraint_json::jsonb
      FROM (VALUES
          ('akademik:nilai:read',         '{"scope":"own"}'),
          ('akademik:jadwal:read',        NULL),
          ('akademik:kurikulum:read',     NULL),
          ('presensi:read',               '{"scope":"own"}'),
          ('presensi:izin:create',        '{"scope":"own"}'),
          ('konten:pengumuman:read',      NULL),
          ('konten:materi:read',          NULL),
          ('pesan:create',                '{"scope":"to_teacher"}'),
          ('pesan:read',                  '{"scope":"own"}'),
          ('keuangan:tagihan:read',       '{"scope":"own"}'),
          ('laporan:akademik:read',       '{"scope":"own"}')
      ) AS c(slug, constraint_json)
      JOIN permissions p ON p.slug = c.slug
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);

    // ORANG TUA permissions
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id, granted, constraint_json)
      SELECT
          '11111111-0000-0000-0000-000000000004',
          p.id,
          TRUE,
          c.constraint_json::jsonb
      FROM (VALUES
          ('akademik:nilai:read',         '{"scope":"own_child"}'),
          ('akademik:jadwal:read',        NULL),
          ('presensi:read',               '{"scope":"own_child"}'),
          ('presensi:izin:create',        '{"scope":"own_child"}'),
          ('konten:pengumuman:read',      NULL),
          ('pesan:create',                '{"scope":"to_teacher"}'),
          ('pesan:read',                  '{"scope":"own"}'),
          ('keuangan:tagihan:read',       '{"scope":"own_child"}'),
          ('laporan:akademik:read',       '{"scope":"own_child"}')
      ) AS c(slug, constraint_json)
      JOIN permissions p ON p.slug = c.slug
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);

    // STAF TU permissions
    await queryRunner.query(`
      INSERT INTO role_permissions (role_id, permission_id, granted, constraint_json)
      SELECT
          '11111111-0000-0000-0000-000000000005',
          p.id,
          TRUE,
          NULL
      FROM permissions p
      WHERE p.slug IN (
          'pengguna:read',
          'akademik:jadwal:read',
          'presensi:read',
          'presensi:export',
          'keuangan:tagihan:create',
          'keuangan:tagihan:read',
          'keuangan:tagihan:update',
          'keuangan:laporan:export',
          'laporan:akademik:read',
          'laporan:akademik:export',
          'konten:pengumuman:create',
          'konten:pengumuman:read',
          'konten:pengumuman:update',
          'pesan:create',
          'pesan:read'
      )
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM role_permissions;`);
  }
}
