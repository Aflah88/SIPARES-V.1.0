<?php
/* ===================================
   SIPARES - File Upload API
   =================================== */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

requireAuth(['user', 'petugas', 'admin']);

if (!isset($_FILES['bukti'])) {
    jsonResponse(['success' => false, 'message' => 'File bukti tidak ditemukan'], 400);
}

$file = $_FILES['bukti'];

// Validate file
$allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'application/pdf'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
    jsonResponse(['success' => false, 'message' => 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau PDF'], 400);
}

if ($file['size'] > $maxSize) {
    jsonResponse(['success' => false, 'message' => 'Ukuran file terlalu besar. Maksimal 5MB'], 400);
}

if ($file['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'Upload gagal'], 500);
}

// Create uploads directory if not exists
$uploadDir = __DIR__ . '/../uploads/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = 'bukti_' . time() . '_' . uniqid() . '.' . $ext;
$filepath = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $filepath)) {
    jsonResponse([
        'success' => true,
        'message' => 'Upload berhasil',
        'data' => [
            'filename' => $filename,
            'path' => 'uploads/' . $filename
        ]
    ]);
} else {
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file'], 500);
}
