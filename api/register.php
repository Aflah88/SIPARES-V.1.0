<?php
/* ===================================
   SIPARES - Registration API (Public)
   Hanya untuk role 'user' (Warga)
   =================================== */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$data = getRequestBody();

$nama     = trim($data['nama'] ?? '');
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$phone    = trim($data['phone'] ?? '');
$rt       = trim($data['rt'] ?? '');
$rw       = trim($data['rw'] ?? '');
$alamat   = trim($data['alamat'] ?? '');

// Validate required fields
if (empty($nama) || empty($username) || empty($password) || empty($phone) || empty($rt) || empty($rw) || empty($alamat)) {
    jsonResponse(['success' => false, 'message' => 'Semua field harus diisi'], 400);
}

if (strlen($password) < 6) {
    jsonResponse(['success' => false, 'message' => 'Password minimal 6 karakter'], 400);
}

if (strlen($username) < 3) {
    jsonResponse(['success' => false, 'message' => 'Username minimal 3 karakter'], 400);
}

$db = getDB();

// Check duplicate username
$check = $db->prepare("SELECT id FROM users WHERE username = ?");
$check->execute([$username]);
if ($check->fetch()) {
    jsonResponse(['success' => false, 'message' => 'Username sudah digunakan, pilih username lain'], 400);
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("INSERT INTO users (nama, username, password, phone, rt, rw, alamat, role) VALUES (?, ?, ?, ?, ?, ?, ?, 'user')");
$stmt->execute([$nama, $username, $hashedPassword, $phone, $rt, $rw, $alamat]);

$newId = $db->lastInsertId();

jsonResponse([
    'success' => true,
    'message' => 'Registrasi berhasil! Silakan login dengan akun baru Anda.',
    'data' => [
        'id' => (int)$newId,
        'nama' => $nama,
        'username' => $username,
        'role' => 'user'
    ]
], 201);
