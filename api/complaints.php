<?php
/* ===================================
   SIPARES - Complaints API
   =================================== */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handlePost();
        break;
    case 'PUT':
        handlePut();
        break;
    default:
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

function handleGet() {
    $user = requireAuth();
    $db = getDB();

    $sql = "SELECT c.*, u.nama as user_name, u.role as user_role FROM complaints c JOIN users u ON c.user_id = u.id";
    $params = [];

    // Non-admin users can only see their own complaints
    if ($user['role'] !== 'admin') {
        $sql .= " WHERE c.user_id = ?";
        $params[] = $user['id'];
    }

    $sql .= " ORDER BY c.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $complaints = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $complaints]);
}

function handlePost() {
    $user = requireAuth(['user', 'petugas']);
    $data = getRequestBody();
    $db = getDB();

    $subjek = trim($data['subjek'] ?? '');
    $pesan  = trim($data['pesan'] ?? '');

    if (empty($subjek) || empty($pesan)) {
        jsonResponse(['success' => false, 'message' => 'Subjek dan pesan harus diisi'], 400);
    }

    $stmt = $db->prepare("INSERT INTO complaints (user_id, subjek, pesan) VALUES (?, ?, ?)");
    $stmt->execute([$user['id'], $subjek, $pesan]);

    $newId = $db->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => 'Komplain berhasil dikirim',
        'data' => [
            'id' => (int)$newId,
            'user_id' => (int)$user['id'],
            'user_name' => $user['nama'],
            'subjek' => $subjek,
            'pesan' => $pesan,
            'status' => 'pending'
        ]
    ], 201);
}

function handlePut() {
    requireAuth(['admin']);
    $id = $_GET['id'] ?? null;

    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'ID diperlukan'], 400);
    }

    $data = getRequestBody();
    $db = getDB();

    $fields = [];
    $params = [];

    if (isset($data['balasan'])) {
        $fields[] = "balasan = ?";
        $params[] = $data['balasan'];
    }
    if (isset($data['status']) && in_array($data['status'], ['pending', 'ditanggapi', 'selesai'])) {
        $fields[] = "status = ?";
        $params[] = $data['status'];
    }

    if (empty($fields)) {
        jsonResponse(['success' => false, 'message' => 'Tidak ada data untuk diupdate'], 400);
    }

    $params[] = $id;
    $sql = "UPDATE complaints SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        jsonResponse(['success' => true, 'message' => 'Komplain berhasil diperbarui']);
    } else {
        jsonResponse(['success' => false, 'message' => 'Komplain tidak ditemukan'], 404);
    }
}
