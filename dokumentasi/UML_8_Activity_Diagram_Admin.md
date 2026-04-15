# 🚶 Activity Diagram — Admin

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## Activity Diagram — Manajemen Sistem SIPARES

```mermaid
flowchart TD
    START(("🟢 Start"))
    LOGIN["Login sebagai Admin"]
    DASHBOARD["Tampilkan halaman Verifikasi Pembayaran"]
    CHOOSE{"Pilih menu"}

    %% Verifikasi Pembayaran
    VERIFY["Menu: Verifikasi Pembayaran"]
    LOAD_TRX["Muat semua transaksi"]
    SHOW_PENDING["Tampilkan statistik + tabel pending"]
    HAS_PENDING{"Ada pembayaran pending?"}
    NO_PENDING["Tampilkan 'Semua Terverifikasi ✅'"]
    VIEW_PROOF["Klik 'Lihat Bukti'"]
    SHOW_PROOF["Modal: foto bukti + detail transaksi"]
    VERIFY_DECISION{"Keputusan?"}
    APPROVE_PAY["Update status = 'verified'"]
    REJECT_PAY["Update status = 'rejected'"]

    %% Manajemen Warga
    WARGA["Menu: Manajemen Warga"]
    LOAD_WARGA["Muat data warga, role=user"]
    SHOW_WARGA["Tampilkan tabel warga"]
    WARGA_ACTION{"Aksi warga?"}
    ADD_WARGA["Tambah warga baru, form lalu POST"]
    EDIT_WARGA["Edit data warga, form lalu PUT"]
    DELETE_WARGA["Hapus warga, konfirmasi lalu DELETE"]

    %% Manajemen Petugas
    PETUGAS["Menu: Manajemen Petugas"]
    LOAD_PETUGAS["Muat data petugas"]
    SHOW_PETUGAS["Tampilkan tabel petugas"]
    PETUGAS_ACTION{"Aksi petugas?"}
    ADD_PETUGAS["Tambah petugas baru"]
    EDIT_PETUGAS["Edit data petugas"]
    DELETE_PETUGAS["Hapus petugas"]

    %% Jadwal
    JADWAL["Menu: Jadwal & Tugas"]
    LOAD_JADWAL["Muat data jadwal"]
    SHOW_JADWAL["Tampilkan tugas submitted + semua jadwal"]
    JADWAL_ACTION{"Aksi jadwal?"}
    ADD_JADWAL["Tambah jadwal baru, tanggal lalu POST"]
    VALIDATE_TASK["Validasi bukti tugas petugas"]
    APPROVE_TASK["Setujui tugas, status='verified'"]
    REJECT_TASK["Tolak tugas, status='rejected'"]

    %% Laporan
    LAPORAN["Menu: Laporan Transaksi"]
    LOAD_LAPORAN["Muat semua transaksi + filter status"]
    SHOW_LAPORAN["Tampilkan tabel laporan lengkap"]

    %% Settings
    SETTINGS["Menu: Pengaturan"]
    LOAD_QRIS["Muat gambar QRIS saat ini"]
    SHOW_QRIS["Preview QRIS atau 'Belum ada'"]
    UPLOAD_QRIS["Upload gambar QRIS baru"]
    SAVE_QRIS["Simpan path ke settings"]

    LOGOUT["Logout"]
    STOP(("🔴 End"))

    START --> LOGIN
    LOGIN --> DASHBOARD
    DASHBOARD --> CHOOSE

    CHOOSE -->|Verifikasi| VERIFY
    CHOOSE -->|Warga| WARGA
    CHOOSE -->|Petugas| PETUGAS
    CHOOSE -->|Jadwal| JADWAL
    CHOOSE -->|Laporan| LAPORAN
    CHOOSE -->|Pengaturan| SETTINGS
    CHOOSE -->|Logout| LOGOUT

    VERIFY --> LOAD_TRX --> SHOW_PENDING --> HAS_PENDING
    HAS_PENDING -->|Tidak| NO_PENDING --> CHOOSE
    HAS_PENDING -->|Ya| VIEW_PROOF --> SHOW_PROOF --> VERIFY_DECISION
    VERIFY_DECISION -->|Setujui| APPROVE_PAY --> CHOOSE
    VERIFY_DECISION -->|Tolak| REJECT_PAY --> CHOOSE

    WARGA --> LOAD_WARGA --> SHOW_WARGA --> WARGA_ACTION
    WARGA_ACTION -->|Tambah| ADD_WARGA --> CHOOSE
    WARGA_ACTION -->|Edit| EDIT_WARGA --> CHOOSE
    WARGA_ACTION -->|Hapus| DELETE_WARGA --> CHOOSE

    PETUGAS --> LOAD_PETUGAS --> SHOW_PETUGAS --> PETUGAS_ACTION
    PETUGAS_ACTION -->|Tambah| ADD_PETUGAS --> CHOOSE
    PETUGAS_ACTION -->|Edit| EDIT_PETUGAS --> CHOOSE
    PETUGAS_ACTION -->|Hapus| DELETE_PETUGAS --> CHOOSE

    JADWAL --> LOAD_JADWAL --> SHOW_JADWAL --> JADWAL_ACTION
    JADWAL_ACTION -->|Tambah Jadwal| ADD_JADWAL --> CHOOSE
    JADWAL_ACTION -->|Validasi Tugas| VALIDATE_TASK
    VALIDATE_TASK -->|Setujui| APPROVE_TASK --> CHOOSE
    VALIDATE_TASK -->|Tolak| REJECT_TASK --> CHOOSE

    LAPORAN --> LOAD_LAPORAN --> SHOW_LAPORAN --> CHOOSE

    SETTINGS --> LOAD_QRIS --> SHOW_QRIS --> UPLOAD_QRIS --> SAVE_QRIS --> CHOOSE

    LOGOUT --> STOP
```

---

## Penjelasan Alur

| No | Menu | Langkah-langkah |
|----|------|-----------------|
| 1 | **Verifikasi Pembayaran** | Lihat daftar pembayaran pending → klik lihat bukti → setujui atau tolak |
| 2 | **Manajemen Warga** | Lihat tabel warga → tambah/edit/hapus data warga |
| 3 | **Manajemen Petugas** | Lihat tabel petugas → tambah/edit/hapus data petugas |
| 4 | **Jadwal & Tugas** | Tambah jadwal baru → validasi bukti tugas petugas (setujui/tolak) |
| 5 | **Laporan Transaksi** | Lihat semua transaksi → filter berdasarkan status |
| 6 | **Pengaturan** | Lihat preview QRIS saat ini → upload QRIS baru → simpan ke database |
| 7 | **Logout** | Keluar dari sistem |
