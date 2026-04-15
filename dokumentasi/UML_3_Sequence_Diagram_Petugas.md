# 🔄 Sequence Diagram — Petugas Kebersihan

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## A. Lihat Jadwal Pengambilan Sampah

```mermaid
sequenceDiagram
    actor P as Petugas Kebersihan
    participant FE as Frontend (Browser)
    participant API as API Jadwal (jadwal.php)
    participant DB as Database MySQL

    P->>FE: Login sebagai Petugas
    FE-->>P: Tampilkan halaman Jadwal

    FE->>API: GET jadwal.php
    API->>API: requireAuth() → cek session
    API->>DB: SELECT j.*, u.nama FROM jadwal j LEFT JOIN users u ON j.completed_by=u.id ORDER BY tanggal ASC
    DB-->>API: Daftar jadwal lengkap
    API-->>FE: {success: true, data: [...]}
    FE->>FE: Filter tugas pending, hari ini, mendatang
    FE-->>P: Tampilkan statistik + jadwal hari ini + jadwal mendatang
```

---

## B. Konfirmasi Penyelesaian Tugas (Submit Bukti)

```mermaid
sequenceDiagram
    actor P as Petugas Kebersihan
    participant FE as Frontend (Browser)
    participant UPLOAD as API Upload (upload.php)
    participant API as API Jadwal (jadwal.php)
    participant DB as Database MySQL

    P->>FE: Klik tombol "Selesai" pada jadwal
    FE-->>P: Modal upload bukti tugas

    P->>FE: Upload file bukti (bisa multiple file)
    FE->>FE: Tampilkan daftar file terupload

    P->>FE: Klik "Kirim & Selesai"

    loop Untuk setiap file
        FE->>UPLOAD: POST upload.php (FormData: bukti file)
        UPLOAD->>UPLOAD: Validasi & simpan file
        UPLOAD-->>FE: {success: true, data: {path: '...'}}
    end

    FE->>API: PUT jadwal.php?id=X {status: 'submitted', bukti: [paths]}
    API->>API: requireAuth(['petugas', 'admin'])
    API->>API: role=petugas → hanya boleh status 'submitted'
    API->>DB: UPDATE jadwal SET status='submitted', bukti=JSON, completed_by=petugas_id WHERE id=?
    DB-->>API: OK (rows updated)
    API-->>FE: {success: true, message: 'Jadwal berhasil diperbarui'}
    FE-->>P: Notifikasi sukses "Menunggu verifikasi admin 🎉"
```

---

## C. Lihat Riwayat Tugas

```mermaid
sequenceDiagram
    actor P as Petugas Kebersihan
    participant FE as Frontend (Browser)
    participant API as API Jadwal (jadwal.php)
    participant DB as Database MySQL

    P->>FE: Klik menu "Riwayat Tugas"
    FE->>API: GET jadwal.php
    API->>DB: SELECT j.*, u.nama FROM jadwal j LEFT JOIN users u ON j.completed_by=u.id
    DB-->>API: Daftar semua jadwal
    API-->>FE: {success: true, data: [...]}
    FE->>FE: Filter: status IN (submitted, verified, rejected) AND completed_by = session.id
    FE-->>P: Tampilkan tabel riwayat tugas (Tanggal, Jumlah Bukti, Status)
```
