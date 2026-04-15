# 🔄 Sequence Diagram — Warga

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## A. Login Warga

```mermaid
sequenceDiagram
    actor W as Warga
    participant FE as Frontend (Browser)
    participant API as API Server (auth.php)
    participant DB as Database MySQL

    W->>FE: Buka halaman SIPARES
    FE->>API: GET auth.php?action=session
    API->>DB: Cek session aktif
    DB-->>API: Session tidak ditemukan
    API-->>FE: {success: false}
    FE-->>W: Tampilkan form login

    W->>FE: Isi role=user, username, password
    W->>FE: Klik tombol "Masuk"
    FE->>API: POST auth.php?action=login {username, password, role}
    API->>DB: SELECT * FROM users WHERE username=? AND role=?
    DB-->>API: Data user ditemukan
    API->>API: password_verify(password, hash)
    API->>API: Simpan ke $_SESSION['user']
    API-->>FE: {success: true, data: user}
    FE-->>W: Tampilkan Dashboard Warga
```

---

## B. Pembayaran Retribusi QRIS

```mermaid
sequenceDiagram
    actor W as Warga
    participant FE as Frontend (Browser)
    participant UPLOAD as API Upload (upload.php)
    participant TRX as API Transaksi (transactions.php)
    participant SET as API Settings (settings.php)
    participant DB as Database MySQL

    W->>FE: Klik menu "Bayar QRIS"
    FE->>SET: GET settings.php?key=qris_image
    SET->>DB: SELECT set_value FROM settings WHERE key_name='qris_image'
    DB-->>SET: path gambar QRIS
    SET-->>FE: {success: true, data: 'uploads/qris.jpg'}
    FE-->>W: Tampilkan QRIS + Form Upload

    W->>W: Scan QRIS, bayar via e-wallet
    W->>FE: Upload bukti pembayaran (file gambar)
    FE->>FE: Validasi file (format, ukuran)
    FE-->>W: Preview file terupload

    W->>FE: Klik "Kirim Pembayaran"
    FE->>UPLOAD: POST upload.php (FormData: bukti file)
    UPLOAD->>UPLOAD: Validasi tipe & ukuran file
    UPLOAD->>UPLOAD: Simpan file ke /uploads/
    UPLOAD-->>FE: {success: true, data: {path: 'uploads/bukti_xxx.jpg'}}

    FE->>TRX: POST transactions.php {bulan, jumlah: 25000, tanggal, bukti}
    TRX->>DB: Cek duplikasi bulan (status != rejected)
    DB-->>TRX: Tidak ada duplikasi
    TRX->>DB: INSERT INTO transactions (...)
    DB-->>TRX: OK (new ID)
    TRX-->>FE: {success: true, message: 'Pembayaran berhasil dikirim'}
    FE-->>W: Notifikasi sukses + redirect ke Dashboard
```

---

## C. Lihat Riwayat Transaksi

```mermaid
sequenceDiagram
    actor W as Warga
    participant FE as Frontend (Browser)
    participant API as API Transaksi (transactions.php)
    participant DB as Database MySQL

    W->>FE: Klik menu "Riwayat Transaksi"
    FE->>API: GET transactions.php
    API->>API: requireAuth() → cek session
    API->>API: role=user → filter user_id = session.id
    API->>DB: SELECT t.*, u.nama FROM transactions t JOIN users u ON t.user_id=u.id WHERE t.user_id=?
    DB-->>API: Daftar transaksi milik warga
    API-->>FE: {success: true, data: [...]}
    FE-->>W: Tampilkan tabel riwayat (ID, Periode, Jumlah, Tanggal, Status)
```

---

## D. Lihat Profil

```mermaid
sequenceDiagram
    actor W as Warga
    participant FE as Frontend (Browser)

    W->>FE: Klik menu "Profil Saya"
    FE->>FE: Ambil data dari session cache (_session)
    FE-->>W: Tampilkan profil (Nama, HP, RT, RW, Alamat, Username)
```
