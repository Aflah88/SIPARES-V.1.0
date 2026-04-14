# Panduan Menyalin & Menginstal Proyek (Deploy) ke Laptop Lain

Aplikasi ini menggunakan perpaduan murni HTML Static dan **PHP MySQL Server**. Oleh karenanya, jika proyek ini hanya di kopi-paste langsung layaknya berkas Microsoft Word ke dalam `Local Disk (D:)` biasa lalu dieksekusi klik 2x, file PHP dan Server Databasenya dipastikan akan mati / tak terbaca. 

Ikuti tata cara di bawah ini untuk menduplikasi aplikasi SIPARES secara sempurna ke dalam Komputer (Laptop) / Server yang baru.

---

### Langkah 1: Persiapan Aplikasi Server Mentah (Di Laptop Baru)
1. Laptop / target baru tersebut **Wajib** terpasang Aplikasi Web Server Lokal. Seperti **Laragon** (Sangat Disarankan) atau XAMPP.
2. Jika memakai **Laragon**, unduh di situs resminya dan instal di titik awal partisinya (contoh: Biarkan terpasang otomatis melahirkan direktori `C:\laragon\`).
3. Jalankan / Buka program Laragon, lalu tekan tombol panah putar **START ALL / Mulai Semuanya** hingga tulisan ikon Apache dan MySQL berwarna indikator _Hijau menyala_.

---

### Langkah 2: Proses Menyalin Folder
1. Dari Laptop Lama Anda (sumber): Kopi seluruh isi folder `D1` utuh atau bungkus dengan format `.zip` (Flashdisk / Google Drive).
2. Pindahkan atau Ekstrak selongsong folder `D1` tersebut ke dalam folder sarang laba-laba Apache di Laptop Baru. Yakni tepat ke dalam direktori:
   `C:\laragon\www\` (Jika anda menggunakan Laragon)
   atau
   `C:\xampp\htdocs\` (Jika anda menggunakan XAMPP lawas).
3. Pastikan urutannya tidak beranak ganda. Contoh yang benar: `C:\laragon\www\D1\index.html`. Bukan `C:\laragon\www\D1\D1\index.html`.

---

### Langkah 3: Re-Strukturisasi Pembentukan MySQL Otomatis 
Di saat ini, file script web anda sudah masuk, *namun Databasenya (Daftar Pengguna, Admin, Tugas)* di Laptop Baru masih **Lumpuh/Kopong**. Untungnya, Anda **tidak perlu mengutak-atik phpMyAdmin** manual dari panel SQL Command!
Sistem pintar yang telah kita sematkan (Script Autopilot MySQL) akan melakukan pekerjaan itu. Jangan pernah lompati langkah ini!

1. Buka Browser (Chrome / Edge / Firefox) kesayangan Anda pada laptop baru tersebut.
2. Ketikkan URL baris *Link Lokal Sakti* eksekusi penyemaian benih database berikut secara manual:
   👉🏼 ** `http://localhost/D1/api/setup.php` ** \
   *(Note Tambahan: Terkadang laragon memakan slot port 8080 agar tidak berbenturan dengan port lain. Bila link diatas tidak mau terbuka/Not Found, ganti memanggil portnya yaitu menjadi `http://localhost:8080/D1/api/setup.php`)*.
3. Begitu menekan *ENTER*, tunggu beberapa detik saja. Layar putih web akan menampilkan deretan logo *Checklist* Hijau yang merincikan bahwa `Tabel Users`, `Tabel Settings` dll. telah dilahirkan secara otomatis ke perut mesin MySQL Laragon tersebut.
4. Anda juga akan melihat konfirmasi *Uploads Directory Creation*. Artinya folder unggahan bukti tugas secara otomatis terpasang dengan Izin Administrasi penuh yang sah!

---

### Langkah 4: Uji Coba Kinerja & Go-Live!
1. Datangkan ke layar Menu Utama aplikasi pada browser anda dengan mengetik:
   👉🏼 ** `http://localhost/D1/` ** (Atau `http://localhost:8080/D1/`)
2. Anda akan dihadapkan dengan pesona halaman Single Page SIPARES dengan animasi gelembung *(Particle)* miliknya.
3. Masuk dengan "Kunci Induk Bawaan" hasil langkah ke-3 *(Setup Seed)* tadi:
    - Masuk dengan Seleksi Peran **Admin**
    - Kolom Input Username ketik huruf kecil: `admin`
    - Kolom Password rahasia: `admin123`
4. Selamat! Migrasi Komputer selesai sepenhunya. Segala fungsi Penjadwalan Warga dan unggah Bukti QRIS milik perangkat yang baru sudah siap untuk diobrak-abrik!
