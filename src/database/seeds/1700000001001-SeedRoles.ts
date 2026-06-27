import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1700000001001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO roles (id, name, slug, description, is_system) VALUES
          ('11111111-0000-0000-0000-000000000001', 'Admin Sekolah', 'admin',      'Akses penuh ke seluruh sistem',                TRUE),
          ('11111111-0000-0000-0000-000000000002', 'Guru',          'guru',       'Akses akademik & presensi kelas yang diampu',   TRUE),
          ('11111111-0000-0000-0000-000000000003', 'Siswa',          'siswa',      'Akses baca data akademik milik sendiri',       TRUE),
          ('11111111-0000-0000-0000-000000000004', 'Orang Tua',      'ortu',       'Akses baca data akademik anak yang terdaftar', TRUE),
          ('11111111-0000-0000-0000-000000000005', 'Staf TU',        'tata_usaha', 'Akses administrasi dan keuangan sekolah',  TRUE)
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM roles WHERE id IN (
        '11111111-0000-0000-0000-000000000001',
        '11111111-0000-0000-0000-000000000002',
        '11111111-0000-0000-0000-000000000003',
        '11111111-0000-0000-0000-000000000004',
        '11111111-0000-0000-0000-000000000005'
      );
    `);
  }
}
