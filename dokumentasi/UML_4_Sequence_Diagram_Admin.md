# 🔄 Sequence Diagram — Admin

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## A. Verifikasi Pembayaran Warga

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant API as API Transaksi (transactions.php)
    participant DB as Database MySQL

    A->>FE: Login sebagai Admin
    FE-->>A: Tampilkan halaman Verifikasi Pembayaran

    FE->>API: GET transactions.php
    API->>API: requireAuth() → role=admin
    API->>DB: SELECT t.*, u.nama FROM transactions t JOIN users u ON t.user_id=u.id ORDER BY id DESC
    DB-->>API: Semua transaksi
    API-->>FE: {success: true, data: [...]}
    FE->>FE: Filter status='pending'
    FE-->>A: Tampilkan kartu statistik + tabel pembayaran pending

    A->>FE: Klik "Lihat Bukti" pada transaksi
    FE-->>A: Modal detail transaksi + gambar bukti

    alt Setujui Pembayaran
        A->>FE: Klik "Setujui"
        FE->>API: PUT transactions.php?id=X {status: 'verified'}
        API->>API: requireAuth(['admin'])
        API->>DB: UPDATE transactions SET status='verified' WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Pembayaran disetujui ✓"
    else Tolak Pembayaran
        A->>FE: Klik "Tolak"
        FE->>API: PUT transactions.php?id=X {status: 'rejected'}
        API->>DB: UPDATE transactions SET status='rejected' WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Pembayaran ditolak ✗"
    end
```

---

## B. Kelola Data Warga (CRUD)

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant API as API Users (users.php)
    participant DB as Database MySQL

    A->>FE: Klik menu "Manajemen Warga"
    FE->>API: GET users.php?role=user
    API->>API: requireAuth(['admin'])
    API->>DB: SELECT id, nama, username, phone, rt, rw, alamat, role FROM users WHERE role='user'
    DB-->>API: Daftar warga
    API-->>FE: {success: true, data: [...]}
    FE-->>A: Tampilkan tabel data warga

    alt Tambah Warga Baru
        A->>FE: Klik "Tambah Warga"
        FE-->>A: Modal form tambah warga
        A->>FE: Isi nama, username, password, phone, RT, RW, alamat
        A->>FE: Klik "Simpan"
        FE->>API: POST users.php {nama, username, password, phone, rt, rw, alamat, role:'user'}
        API->>DB: Cek duplikasi username
        API->>API: password_hash(password)
        API->>DB: INSERT INTO users (...)
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Warga berhasil ditambahkan"
    else Edit Data Warga
        A->>FE: Klik "Edit" pada baris warga
        FE->>API: GET users.php?id=X
        API->>DB: SELECT ... FROM users WHERE id=?
        DB-->>API: Data warga
        API-->>FE: {success: true, data: {...}}
        FE-->>A: Modal form edit (pre-filled)
        A->>FE: Ubah data, klik "Simpan Perubahan"
        FE->>API: PUT users.php?id=X {nama, phone, rt, rw, alamat}
        API->>DB: UPDATE users SET ... WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Data berhasil diperbarui"
    else Hapus Warga
        A->>FE: Klik "Hapus" pada baris warga
        FE-->>A: Konfirmasi dialog "Yakin hapus?"
        A->>FE: Klik "Hapus"
        FE->>API: DELETE users.php?id=X
        API->>API: Cek bukan akun sendiri
        API->>DB: DELETE FROM users WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Warga berhasil dihapus"
    end
```

---

## C. Kelola Data Petugas (CRUD)

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant API as API Users (users.php)
    participant DB as Database MySQL

    A->>FE: Klik menu "Manajemen Petugas"
    FE->>API: GET users.php?role=petugas
    API->>API: requireAuth(['admin'])
    API->>DB: SELECT id, nama, username, phone, role FROM users WHERE role='petugas'
    DB-->>API: Daftar petugas
    API-->>FE: {success: true, data: [...]}
    FE-->>A: Tampilkan tabel data petugas

    alt Tambah Petugas Baru
        A->>FE: Klik "Tambah Petugas"
        FE-->>A: Modal form tambah petugas
        A->>FE: Isi nama, username, password, phone
        A->>FE: Klik "Simpan"
        FE->>API: POST users.php {nama, username, password, phone, role:'petugas'}
        API->>DB: Cek duplikasi username
        API->>API: password_hash(password)
        API->>DB: INSERT INTO users (...)
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Petugas berhasil ditambahkan"
    else Edit Data Petugas
        A->>FE: Klik "Edit" pada baris petugas
        FE->>API: GET users.php?id=X
        API->>DB: SELECT ... FROM users WHERE id=?
        DB-->>API: Data petugas
        API-->>FE: {success: true, data: {...}}
        FE-->>A: Modal form edit (pre-filled)
        A->>FE: Ubah data, klik "Simpan Perubahan"
        FE->>API: PUT users.php?id=X {nama, phone}
        API->>DB: UPDATE users SET ... WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Data petugas berhasil diperbarui"
    else Hapus Petugas
        A->>FE: Klik "Hapus" pada baris petugas
        FE-->>A: Konfirmasi dialog "Yakin hapus?"
        A->>FE: Klik "Hapus"
        FE->>API: DELETE users.php?id=X
        API->>API: Cek bukan akun sendiri
        API->>DB: DELETE FROM users WHERE id=?
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Petugas berhasil dihapus"
    end
```

---

## D. Kelola Jadwal & Validasi Tugas Petugas

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant API as API Jadwal (jadwal.php)
    participant DB as Database MySQL

    A->>FE: Klik menu "Jadwal & Tugas"
    FE->>API: GET jadwal.php
    API->>DB: SELECT j.*, u.nama FROM jadwal j LEFT JOIN users u ON j.completed_by=u.id
    DB-->>API: Semua jadwal
    API-->>FE: {success: true, data: [...]}
    FE-->>A: Tabel tugas menunggu + semua jadwal

    alt Tambah Jadwal Baru
        A->>FE: Klik "Tambah Jadwal"
        FE-->>A: Modal form tanggal
        A->>FE: Pilih tanggal, klik "Simpan"
        FE->>API: POST jadwal.php {tanggal: '2026-04-20'}
        API->>DB: INSERT INTO jadwal (tanggal, status='pending')
        DB-->>API: OK
        API-->>FE: {success: true}
        FE-->>A: Notifikasi "Jadwal ditambahkan"
    else Validasi Bukti Tugas Petugas
        A->>FE: Klik "Validasi" pada tugas submitted
        FE-->>A: Modal bukti foto/PDF + detail
        alt Setujui Tugas
            A->>FE: Klik "Setujui"
            FE->>API: PUT jadwal.php?id=X {status: 'verified'}
            API->>DB: UPDATE jadwal SET status='verified' WHERE id=?
            DB-->>API: OK
            API-->>FE: {success: true}
            FE-->>A: "Tugas disetujui ✓"
        else Tolak Tugas
            A->>FE: Klik "Tolak"
            FE->>API: PUT jadwal.php?id=X {status: 'rejected'}
            API->>DB: UPDATE jadwal SET status='rejected' WHERE id=?
            DB-->>API: OK
            API-->>FE: {success: true}
            FE-->>A: "Tugas ditolak, petugas perlu melapor ulang"
        end
    end
```

---

## E. Laporan Transaksi

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant API as API Transaksi (transactions.php)
    participant DB as Database MySQL

    A->>FE: Klik menu "Laporan Transaksi"
    FE->>API: GET transactions.php
    API->>API: requireAuth() → role=admin
    API->>DB: SELECT t.*, u.nama FROM transactions t JOIN users u ON t.user_id=u.id ORDER BY id DESC
    DB-->>API: Semua transaksi
    API-->>FE: {success: true, data: [...]}
    FE-->>A: Tampilkan tabel semua transaksi + filter dropdown

    A->>FE: Pilih filter status (pending/verified/rejected)
    FE->>API: GET transactions.php?status=verified
    API->>DB: SELECT ... WHERE status='verified'
    DB-->>API: Transaksi terfilter
    API-->>FE: {success: true, data: [...]}
    FE-->>A: Tampilkan tabel hasil filter
```

---

## F. Pengaturan QRIS

```mermaid
sequenceDiagram
    actor A as Admin
    participant FE as Frontend (Browser)
    participant UPLOAD as API Upload (upload.php)
    participant SET as API Settings (settings.php)
    participant DB as Database MySQL

    A->>FE: Klik menu "Pengaturan"
    FE->>SET: GET settings.php?key=qris_image
    SET->>DB: SELECT set_value FROM settings WHERE key_name='qris_image'
    DB-->>SET: path / kosong
    SET-->>FE: {success: true, data: '...'}
    FE-->>A: Preview QRIS saat ini (atau "Belum ada")

    A->>FE: Klik "Upload / Ganti QRIS"
    A->>FE: Pilih file gambar QRIS
    FE->>UPLOAD: POST upload.php (FormData: bukti=qris_image)
    UPLOAD->>UPLOAD: Validasi & simpan file
    UPLOAD-->>FE: {success: true, data: {path: 'uploads/bukti_xxx.jpg'}}

    FE->>SET: PUT settings.php {key: 'qris_image', value: 'uploads/bukti_xxx.jpg'}
    SET->>SET: requireAuth(['admin'])
    SET->>DB: INSERT INTO settings (...) ON DUPLICATE KEY UPDATE set_value=?
    DB-->>SET: OK
    SET-->>FE: {success: true}
    FE-->>A: Notifikasi "QRIS berhasil diperbarui ✓" + refresh preview
```
