# Arsitektur Proyek, Struktur, dan Penjelasan Kode SIPARES

Dokumen ini menjelaskan struktur arsitektur lengkap, fungsi masing-masing komponen file, dan membedah alur logika (dengan sisipan *comment* instruksi per baris) di balik modul-modul sistem utama.

SIPARES menggunakan rancang-bangun **Decoupled Architecture**; memisahkan antarmuka (Front-End) yang melulu menggunakan `HTML+CSS+JS` Murni, dengan logika penyimpanan (Back-End) yang dijalankan murni sebagai *Restful API (PHP & MySQL)*. Keduanya saling berbicara via `Fetch API` di JavaScript.

---

## DAFTAR ISI (STRUKTUR FOLDER)

```text
C:\laragon\www\D1\
├── index.html            // File gerbang awal (Single Page Application)
├── database.sql          // Cetak biru / Skeleton struktur tabel MySQL Server
├── css/
│   └── style.css         // Seluruh corak kosmetika, tata letak, dan grid layar di HP/Desktop
├── js/
│   ├── app.js            // Otak rute (Router), manajemen sesi login, dan layouting bingkai
│   ├── data.js           // Layanan Komunikasi Jembatan (Perantara) fetch() ke Database PHP
│   ├── admin.js          // Khusus UI (User Interface) Menu Administrator
│   ├── petugas.js        // Khusus UI (User Interface) Menu Petugas Lapangan
│   └── user.js           // Khusus UI (User Interface) Menu Navigasi Warga Penduduk
├── api/
│   ├── config.php        // "Paspor" Konektor Database koneksi PDO dan Helpers Security Parameter
│   ├── setup.php         // Skrip instalator otomatis (Menciptakan Semua Berkas Database SQL)
│   ├── login.php         // Mesin Penyelaras Kredensial, Autentikasi Pengguna, dan Session Creation
│   ├── transactions.php  // Perekam Lapor Keuangan/Riwayat Setor Uang Tunai Retribusi
│   ├── jadwal.php        // Perekam Titik Jemput Jadwal Eksekusi Waktu Lapangan, Unggahan dsb
│   ├── settings.php      // API Variabel Pengaturan Dinamik seperti konfigurasi Foto Logo QRIS Admin
│   ├── upload.php        // API Validasi Penyusup (Security), memastikan file hanyalah ekstensi PDF/PNG/JPG (Max 5MB)
│   └── users.php         // Pengelola Pintu CRUD pembuatan Data Personel Warga & Aparatur Pembersih
└── uploads/              // Berkas File Unggahan (Gambar Bukti, Foto Tagihan) Semua terpusat dilindungi (Di-ignore dari sistem git jika ada)
```

---

## PEMBEDAHAN FILE UTAMA (LENGKAP DENGAN KOMENTAR)

### 1. File Database Connection (`api/config.php`)
Inti jantung aplikasi yang mengatur bagaimana Server dapat berpelukan dengan *MySQL Server Database*. Menggunakan PDO (*PHP Data Objects*) sehingga aplikasi imun terhadap eksploitasi peretas (contoh: *SQL Injection*).

```php
// ==========================================
// file: api/config.php
// ==========================================
session_start(); // Membuka jalur "Memory Kotak" yang menjaga sesi siapapun yang login di browser HP

function getDB() {
    $host = 'localhost';     // Menuju ke gerbang MySQL Laragon
    $dbname = 'sipares';     // Target lemari Data Table Retribusi 
    $user = 'root';          // Account tertinggi MySQL
    $pass = '';              // Password dari database Laragon (dibiar default kosong)

    try {
        // Melakukan Koneksi ke "Lemari Database" menggunakan driver PDO dan string UTF-8 agar nama karakter aneh warga tidak rusak/error
        $db = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
        
        // Memerintahkan PHP untuk selalu menceritakan Exception Alert jika SQL-nya cacat / Typo sintak
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Memerintahkan kolom Fetch() MySQL menjadi format Dictionary Array biasa (hemat memory Server RAM)
        $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        return $db;
        
    } catch (PDOException $e) { // Menangkis/Sembunyikan pesan merah panjang apabila MySQL down/mati
        jsonResponse(['success' => false, 'message' => 'Gagal terkoneksi ke database server.'], 500); 
    }
}

function requireAuth($allowedRoles = []) {
    // Apabila sesi peran ($_SESSION) kosong -> Artinya maling luar/tamu belum login
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized. Must login.'], 401);
    }

    // Tapi Jika sistem mengatur bahwa cuma 1 ROLE tertentu yang boleh lewat.
    // Misal: Admin doang. (Maka peran 'user / warga' jika lewat akan dijegal via 403 Forbidden).
    if (!empty($allowedRoles) && !in_array($_SESSION['role'], $allowedRoles)) {
        jsonResponse(['success' => false, 'message' => 'Forbidden. Role not allowed.'], 403);
    }
}
```

### 2. File Modul File Upload (`api/upload.php`)
Pengaman dan pengambil data *"Tarik-Turun File"* dokumen fisik Struk Bayar atau Dokumentasi tugas keliling perumahan.
```php
// ==========================================
// file: api/upload.php
// ==========================================

// Menarik kunci fungsi requireAuth dan database connection dari config.php
require_once __DIR__ . '/config.php'; 

// Harus metode kiriman file (POST/Payload MultiPart). Bukan GET murni.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

// WAJIB SUDAH LOGIN! Dan diizinkan untuk semua peran kecuali anonim ilegal.
requireAuth(['user', 'petugas', 'admin']);

// Menerima Kiriman File Temporer Binari dari Browser 
$file = $_FILES['bukti'];

// Memblokir Paksa Jika tipe file berbau program komputer (.exe, .php dll)
// Dan Hanya toleransi pada gambar format dasar dan PDF
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
if (!in_array($file['type'], $allowedTypes)) {
    jsonResponse(['success' => false, 'message' => 'Format file tidak didukung.'], 400); 
}

// Generate Kata Acak di ujung File agar bilamana ada warga nge-upload 2 gambar bernama "foto_struk.jpg" berbarengan, file lamanya tidak tertumpuk timpa mati di Server. 
// Contoh: bukti_5289129023_8b1x.jpg
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'bukti_' . time() . '_' . uniqid() . '.' . $ext;

// Eksekusi peletakan file dari Folder Temporari PHP ke lokasi Folder /uploads/ pada C:\Laragon\www\...
if (move_uploaded_file($file['tmp_name'], $filepath)) {
    jsonResponse([ // Kembalikan Balasan Ke Front-End JavaScript beserta Alur Link Gambarnya.
        'success' => true,
        'message' => 'Upload berhasil',
        'data' => [ 'path' => 'uploads/' . $filename ]
    ]);
}
```

### 3. File Logika Mesin Fetch Front-End (`js/data.js`)
File ini murni sebagai "Kurir Pengantar Surat". Aplikasi anda di browser (HTML) tidak tahu menahu soal PHP. Maka dia akan menyerahkan data kotor ke `DataStore` yang ada pada file ini.

```javascript
// ==========================================
// file: js/data.js
// ==========================================

const DataStore = {
  // Fungsi Inti Tembakan Pistol Senapan URL. Setiap memanggil backend, fungsi ini jadi jembatan HTTP-nya
  async api(endpoint, options = {}) {
    try {
      // url endpoint. contoh jika string param endpoint adalah "upload.php", maka tujuannya jadi -> http://localhost:8080/api/upload.php
      const res = await fetch(`api/${endpoint}`, {
        ...options,
      });

      // Menulis penerjemahan data mentah (Byte String) dari server kembali menjadi Kamus Objek JSON yang difahami JavaSript kembali.
      const data = await res.json();
      return data;
    } catch (e) {
      console.error('API Error:', e);
      return { success: false, message: 'Server error/Disconnected' };
    }
  },

  // Contoh Jembatan: Login Ke PHP Endpoint
  async login(username, password, role) {
    const res = await this.api('login.php', {
      method: 'POST',
      // Mengubah string variable pass & username ke kerangka format POST JSON 
      body: JSON.stringify({ username, password, role }), 
    });

    if (res.success) { // Jika Config PHP diujung sana bilang sukses
      this.localSession = res.data; // Kita simpan Cache/Identitas Warga kedalam Variabel lokal JavaScript memory
      return res.data; 
    }
    return null; // jika salah password, lepaskan gagal nil/null.
  }
};
```

### 4. File Alur Tampilan & Penjaga Privatisasi Tampilan (js/app.js)
File ini bekerja bagaikan Satpam Apartemen Lobby (HTML). Ia memutuskan warga masuknya di lantai berapa, Admin dialihkan ke lantai ruangan mana.
```javascript
// ==========================================
// file: js/app.js
// ==========================================

  async renderDashboard() {
    // 1. Ambil ID Kartu Apartemen warga 
    const session = DataStore.getSession();
    
    // 2. Satpam menguji: Jika Kosong (belum login sama sekali di php session localMemory/Cookies), Lempar Jauh ke Gerbang Halaman Form Login HTML Ulang! Modar lu!
    if (!session) return this.renderLogin();

    const role = session.role;
    let module;

    // 3. Menentukan Kotak Modul UI apa yang mesti dirender kedelam Kotak Main Content.
    // Setiap variabel Role menyimpan Layout/Cetakan (Template) List Tabel yang jauh berbeda-beda kemewahannya.
    if (role === 'admin') {
      module = AdminModule;
    } else if (role === 'petugas') {
      module = PetugasModule;
    } else {
      module = UserModule;
    }

    // 4. Perintahkan JS (innerHTML) merombak bersih halaman web yang putih kosong menjadi rangka Sidebar Menu + Main Grid System (Kotak-Kotak Layar).
    const root = document.getElementById('app');
    
    // String tanda kutip koma (`) digunakan sebagai pengetikan multiline String HTML yang bersih. Variabel dicetak menggunakan kurung kurawal dollar ${..}
    root.innerHTML = `
      ... 
      <div id="main-body" class="main-body"> 
         <!-- Menarik fungsi getTemplate dari Modul User/Admin yg terpilih, lalu "SUNTIK" konten template ke div ini. -> Inilah inti dari SPA (Single Page Applications) milik Facebook React! Halaman tidak perlu Reload Tab Broswer Sama Sekali!! -->
         ${await module.renderContent()}
      </div>
      ...
    `;
  }
```
