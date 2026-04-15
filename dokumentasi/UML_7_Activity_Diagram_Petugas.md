# 🚶 Activity Diagram — Petugas Kebersihan

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## Activity Diagram — Penyelesaian Tugas Pengambilan Sampah

```mermaid
flowchart TD
    START(("🟢 Start"))
    LOGIN["Buka halaman SIPARES"]
    SHOW_LOGIN["Tampilkan form login"]
    INPUT_CRED["Input role=Petugas, username, password"]
    VALIDATE_LOGIN{"Kredensial valid?"}
    LOGIN_FAIL["Tampilkan error login"]
    DASHBOARD["Tampilkan halaman Jadwal Pengambilan"]
    LOAD_JADWAL["Muat data jadwal dari server"]
    SHOW_STATS["Tampilkan statistik: Hari Ini / Menunggu / Selesai"]
    CHECK_TODAY{"Ada tugas hari ini?"}
    SHOW_TODAY["Tampilkan jadwal hari ini - highlight"]
    SHOW_UPCOMING["Tampilkan jadwal mendatang"]

    CHOOSE{"Pilih aksi"}

    KLIK_SELESAI["Klik 'Selesai' pada tugas"]
    MODAL_UPLOAD["Modal upload bukti tugas"]
    UPLOAD_FILES["Upload file bukti - bisa multiple"]
    ADD_MORE{"Tambah file lagi?"}
    SUBMIT_TASK["Klik 'Kirim & Selesai'"]
    CHECK_FILES{"Minimal 1 file?"}
    FILE_ERROR["Error: Minimal 1 file bukti"]
    UPLOAD_LOOP["Upload semua file ke server"]
    UPDATE_STATUS["Update jadwal status='submitted' + bukti paths"]
    TASK_SUCCESS["Notifikasi: Menunggu verifikasi admin 🎉"]

    RIWAYAT["Klik menu Riwayat Tugas"]
    LOAD_HISTORY["Muat riwayat tugas saya"]
    SHOW_HISTORY["Tampilkan tabel riwayat: Tanggal, Bukti, Status"]

    LOGOUT["Logout"]
    STOP(("🔴 End"))

    START --> LOGIN
    LOGIN --> SHOW_LOGIN
    SHOW_LOGIN --> INPUT_CRED
    INPUT_CRED --> VALIDATE_LOGIN
    VALIDATE_LOGIN -->|Tidak| LOGIN_FAIL
    LOGIN_FAIL --> SHOW_LOGIN
    VALIDATE_LOGIN -->|Ya| DASHBOARD

    DASHBOARD --> LOAD_JADWAL
    LOAD_JADWAL --> SHOW_STATS
    SHOW_STATS --> CHECK_TODAY
    CHECK_TODAY -->|Ya| SHOW_TODAY
    CHECK_TODAY -->|Tidak| SHOW_UPCOMING
    SHOW_TODAY --> SHOW_UPCOMING
    SHOW_UPCOMING --> CHOOSE

    CHOOSE -->|Selesaikan Tugas| KLIK_SELESAI
    CHOOSE -->|Riwayat| RIWAYAT
    CHOOSE -->|Logout| LOGOUT

    KLIK_SELESAI --> MODAL_UPLOAD
    MODAL_UPLOAD --> UPLOAD_FILES
    UPLOAD_FILES --> ADD_MORE
    ADD_MORE -->|Ya| UPLOAD_FILES
    ADD_MORE -->|Tidak| SUBMIT_TASK
    SUBMIT_TASK --> CHECK_FILES
    CHECK_FILES -->|Tidak| FILE_ERROR
    FILE_ERROR --> MODAL_UPLOAD
    CHECK_FILES -->|Ya| UPLOAD_LOOP
    UPLOAD_LOOP --> UPDATE_STATUS
    UPDATE_STATUS --> TASK_SUCCESS
    TASK_SUCCESS --> DASHBOARD

    RIWAYAT --> LOAD_HISTORY
    LOAD_HISTORY --> SHOW_HISTORY
    SHOW_HISTORY --> CHOOSE

    LOGOUT --> STOP
```

---

## Penjelasan Alur

| No | Langkah | Keterangan |
|----|---------|------------|
| 1 | **Login** | Petugas login dengan role=petugas, username, dan password |
| 2 | **Dashboard Jadwal** | Menampilkan statistik (tugas hari ini, menunggu, selesai) |
| 3 | **Cek Tugas Hari Ini** | Jika ada tugas hari ini, tampilkan dengan highlight biru |
| 4 | **Jadwal Mendatang** | Tampilkan jadwal yang belum dikerjakan |
| 5 | **Selesaikan Tugas** | Klik "Selesai" → muncul modal upload bukti |
| 6 | **Upload Bukti** | Petugas bisa upload multiple file (foto/PDF) sebagai bukti |
| 7 | **Validasi File** | Minimal 1 file harus diupload sebelum submit |
| 8 | **Submit Tugas** | Upload semua file → update status jadwal menjadi "submitted" |
| 9 | **Menunggu Verifikasi** | Tugas menunggu validasi dari admin |
| 10 | **Riwayat** | Lihat daftar tugas yang sudah dikerjakan beserta statusnya |
| 11 | **Logout** | Keluar dari sistem |
