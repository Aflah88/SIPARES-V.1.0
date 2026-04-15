# 🚶 Activity Diagram — Warga

**SIPARES - Sistem Pembayaran Retribusi Sampah**

---

## Activity Diagram — Pembayaran Retribusi Sampah

```mermaid
flowchart TD
    START(("🟢 Start"))
    LOGIN["Buka halaman SIPARES"]
    CHECK_SESSION{"Session aktif?"}
    SHOW_LOGIN["Tampilkan form login"]
    INPUT_CRED["Input role=Warga, username, password"]
    VALIDATE_LOGIN{"Kredensial valid?"}
    LOGIN_FAIL["Tampilkan error 'Username/password salah'"]
    DASHBOARD["Tampilkan Dashboard Warga"]
    CHECK_MONTH{"Bulan ini sudah bayar?"}
    SHOW_WARNING["Tampilkan peringatan tagihan"]
    CHOOSE_MENU{"Pilih menu"}

    BAYAR["Buka menu Bayar QRIS"]
    LOAD_QRIS["Muat gambar QRIS dari server"]
    SCAN_QRIS["Scan QRIS & bayar via e-wallet"]
    UPLOAD_BUKTI["Upload bukti pembayaran"]
    VALIDATE_FILE{"File valid? format & ukuran"}
    FILE_INVALID["Tampilkan error format/ukuran"]
    SUBMIT_PAYMENT["Kirim pembayaran ke server"]
    CHECK_DUP{"Sudah bayar bulan ini?"}
    DUP_ERROR["Error: Sudah bayar bulan ini"]
    PAYMENT_SUCCESS["Pembayaran berhasil dikirim, status: pending"]

    RIWAYAT["Buka menu Riwayat Transaksi"]
    LOAD_TRX["Muat transaksi dari API"]
    SHOW_TRX["Tampilkan tabel riwayat"]

    PROFIL["Buka menu Profil Saya"]
    SHOW_PROFIL["Tampilkan data profil"]

    LOGOUT["Logout"]
    STOP(("🔴 End"))

    START --> LOGIN
    LOGIN --> CHECK_SESSION
    CHECK_SESSION -->|Ya| DASHBOARD
    CHECK_SESSION -->|Tidak| SHOW_LOGIN
    SHOW_LOGIN --> INPUT_CRED
    INPUT_CRED --> VALIDATE_LOGIN
    VALIDATE_LOGIN -->|Tidak| LOGIN_FAIL
    LOGIN_FAIL --> SHOW_LOGIN
    VALIDATE_LOGIN -->|Ya| DASHBOARD

    DASHBOARD --> CHECK_MONTH
    CHECK_MONTH -->|Belum| SHOW_WARNING
    SHOW_WARNING --> CHOOSE_MENU
    CHECK_MONTH -->|Sudah| CHOOSE_MENU

    CHOOSE_MENU -->|Bayar QRIS| BAYAR
    CHOOSE_MENU -->|Riwayat| RIWAYAT
    CHOOSE_MENU -->|Profil| PROFIL
    CHOOSE_MENU -->|Logout| LOGOUT

    BAYAR --> LOAD_QRIS
    LOAD_QRIS --> SCAN_QRIS
    SCAN_QRIS --> UPLOAD_BUKTI
    UPLOAD_BUKTI --> VALIDATE_FILE
    VALIDATE_FILE -->|Tidak| FILE_INVALID
    FILE_INVALID --> UPLOAD_BUKTI
    VALIDATE_FILE -->|Ya| SUBMIT_PAYMENT
    SUBMIT_PAYMENT --> CHECK_DUP
    CHECK_DUP -->|Ya| DUP_ERROR
    DUP_ERROR --> CHOOSE_MENU
    CHECK_DUP -->|Tidak| PAYMENT_SUCCESS
    PAYMENT_SUCCESS --> DASHBOARD

    RIWAYAT --> LOAD_TRX
    LOAD_TRX --> SHOW_TRX
    SHOW_TRX --> CHOOSE_MENU

    PROFIL --> SHOW_PROFIL
    SHOW_PROFIL --> CHOOSE_MENU

    LOGOUT --> STOP
```

---

## Penjelasan Alur

| No | Langkah | Keterangan |
|----|---------|------------|
| 1 | **Login** | Warga membuka halaman dan sistem mengecek apakah session masih aktif |
| 2 | **Dashboard** | Menampilkan ringkasan: total pembayaran, status bulan ini, transaksi terakhir |
| 3 | **Cek Bulan Ini** | Jika belum bayar bulan ini, tampilkan peringatan tagihan |
| 4 | **Bayar QRIS** | Muat gambar QRIS → scan & bayar → upload bukti → kirim ke server |
| 5 | **Validasi File** | Cek format (JPG/PNG/WebP/PDF) dan ukuran (maks 5MB) |
| 6 | **Cek Duplikasi** | Server memastikan belum ada pembayaran bulan ini (kecuali yang ditolak) |
| 7 | **Riwayat** | Menampilkan tabel semua transaksi warga |
| 8 | **Profil** | Menampilkan informasi nama, HP, RT/RW, alamat |
| 9 | **Logout** | Menghapus session dan kembali ke halaman login |
