import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedPermissions1700000001002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO permissions (module, action, slug, description) VALUES
          -- Modul: Pengguna
          ('pengguna', 'create', 'pengguna:create',        'Tambah pengguna baru'),
          ('pengguna', 'read',   'pengguna:read',           'Lihat daftar pengguna'),
          ('pengguna', 'update', 'pengguna:update',         'Edit data pengguna'),
          ('pengguna', 'delete', 'pengguna:delete',         'Hapus pengguna'),
          ('pengguna', 'manage', 'pengguna:role:manage',    'Atur role dan permission pengguna'),

          -- Modul: Akademik - Nilai
          ('akademik', 'create', 'akademik:nilai:create',   'Input nilai siswa'),
          ('akademik', 'read',   'akademik:nilai:read',     'Lihat nilai siswa'),
          ('akademik', 'update', 'akademik:nilai:update',   'Edit nilai siswa'),
          ('akademik', 'delete', 'akademik:nilai:delete',   'Hapus entri nilai'),
          ('akademik', 'export', 'akademik:nilai:export',   'Ekspor rekap nilai ke Excel/PDF'),

          -- Modul: Akademik - Jadwal
          ('akademik', 'create', 'akademik:jadwal:create',  'Buat jadwal pelajaran'),
          ('akademik', 'read',   'akademik:jadwal:read',    'Lihat jadwal pelajaran'),
          ('akademik', 'update', 'akademik:jadwal:update',  'Edit jadwal pelajaran'),
          ('akademik', 'delete', 'akademik:jadwal:delete',  'Hapus jadwal'),

          -- Modul: Akademik - Kurikulum
          ('akademik', 'create', 'akademik:kurikulum:create', 'Buat kurikulum / silabus'),
          ('akademik', 'read',   'akademik:kurikulum:read',   'Lihat kurikulum'),
          ('akademik', 'update', 'akademik:kurikulum:update', 'Edit kurikulum'),

          -- Modul: Presensi
          ('presensi', 'create', 'presensi:create',         'Input kehadiran siswa'),
          ('presensi', 'read',   'presensi:read',            'Lihat rekap kehadiran'),
          ('presensi', 'update', 'presensi:update',          'Edit data kehadiran'),
          ('presensi', 'delete', 'presensi:delete',          'Hapus entri kehadiran'),
          ('presensi', 'export', 'presensi:export',          'Ekspor rekap kehadiran'),
          ('presensi', 'create', 'presensi:izin:create',    'Ajukan izin / sakit'),
          ('presensi', 'read',   'presensi:izin:read',      'Lihat pengajuan izin'),
          ('presensi', 'update', 'presensi:izin:approve',   'Setujui / tolak izin'),

          -- Modul: Konten
          ('konten',   'create', 'konten:pengumuman:create', 'Buat pengumuman'),
          ('konten',   'read',   'konten:pengumuman:read',   'Lihat pengumuman'),
          ('konten',   'update', 'konten:pengumuman:update', 'Edit pengumuman'),
          ('konten',   'delete', 'konten:pengumuman:delete', 'Hapus pengumuman'),
          ('konten',   'create', 'konten:materi:create',     'Upload materi pembelajaran'),
          ('konten',   'read',   'konten:materi:read',       'Unduh/lihat materi'),
          ('konten',   'delete', 'konten:materi:delete',     'Hapus materi'),

          -- Modul: Pesan
          ('pesan',    'create', 'pesan:create',             'Kirim pesan / notifikasi'),
          ('pesan',    'read',   'pesan:read',               'Baca pesan masuk'),

          -- Modul: Keuangan
          ('keuangan', 'create', 'keuangan:tagihan:create',  'Buat tagihan SPP'),
          ('keuangan', 'read',   'keuangan:tagihan:read',    'Lihat tagihan dan pembayaran'),
          ('keuangan', 'update', 'keuangan:tagihan:update',  'Edit tagihan'),
          ('keuangan', 'export', 'keuangan:laporan:export',  'Ekspor laporan keuangan'),

          -- Modul: Laporan
          ('laporan',  'read',   'laporan:akademik:read',    'Lihat laporan akademik'),
          ('laporan',  'export', 'laporan:akademik:export',  'Ekspor laporan akademik'),

          -- Modul: Sistem
          ('sistem',   'manage', 'sistem:konfigurasi',       'Konfigurasi pengaturan sistem'),
          ('sistem',   'read',   'sistem:audit:read',        'Lihat audit log')
      ON CONFLICT (slug) DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM permissions;`);
  }
}
