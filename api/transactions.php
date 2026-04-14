<?php
/* ===================================
   SIPARES - Transactions API
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

    $status = $_GET['status'] ?? null;
    $userId = $_GET['user_id'] ?? null;

    // If user role, only show own transactions
    if ($user['role'] === 'user') {
        $userId = $user['id'];
    }

    $sql = "SELECT t.*, u.nama as user_name FROM transactions t JOIN users u ON t.user_id = u.id";
    $conditions = [];
    $params = [];

    if ($userId) {
        $conditions[] = "t.user_id = ?";
        $params[] = $userId;
    }

    if ($status) {
        $conditions[] = "t.status = ?";
        $params[] = $status;
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " ORDER BY t.id DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $transactions = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $transactions]);
}

function handlePost() {
    $user = requireAuth(['user']);
    $data = getRequestBody();
    $db = getDB();

    $bulan = $data['bulan'] ?? '';
    $jumlah = $data['jumlah'] ?? 25000;
    $tanggal = $data['tanggal'] ?? date('Y-m-d');
    $bukti = $data['bukti'] ?? null;

    if (empty($bulan)) {
        jsonResponse(['success' => false, 'message' => 'Bulan harus diisi'], 400);
    }

    // Check if already paid for this month (excluding rejected)
    $check = $db->prepare("SELECT id FROM transactions WHERE user_id = ? AND bulan = ? AND status != 'rejected'");
    $check->execute([$user['id'], $bulan]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Anda sudah melakukan pembayaran untuk bulan ini'], 400);
    }

    $stmt = $db->prepare("INSERT INTO transactions (user_id, bulan, jumlah, tanggal, status, bukti) VALUES (?, ?, ?, ?, 'pending', ?)");
    $stmt->execute([$user['id'], $bulan, $jumlah, $tanggal, $bukti]);

    $newId = $db->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => 'Pembayaran berhasil dikirim',
        'data' => [
            'id' => (int)$newId,
            'user_id' => (int)$user['id'],
            'user_name' => $user['nama'],
            'bulan' => $bulan,
            'jumlah' => (int)$jumlah,
            'tanggal' => $tanggal,
            'status' => 'pending',
            'bukti' => $bukti
        ]
    ], 201);
}

function handlePut() {
    $user = requireAuth(['admin']);
    $id = $_GET['id'] ?? null;

    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'ID diperlukan'], 400);
    }

    $data = getRequestBody();
    $status = $data['status'] ?? null;

    if (!$status || !in_array($status, ['verified', 'rejected', 'pending'])) {
        jsonResponse(['success' => false, 'message' => 'Status tidak valid'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("UPDATE transactions SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    if ($stmt->rowCount() > 0) {
        jsonResponse(['success' => true, 'message' => 'Status transaksi berhasil diperbarui']);
    } else {
        jsonResponse(['success' => false, 'message' => 'Transaksi tidak ditemukan'], 404);
    }
}
