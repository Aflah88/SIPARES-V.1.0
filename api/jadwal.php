<?php
/* ===================================
   SIPARES - Jadwal API
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

    $sql = "SELECT j.*, u.nama as completed_by_name FROM jadwal j LEFT JOIN users u ON j.completed_by = u.id";
    $conditions = [];
    $params = [];

    if ($status) {
        $conditions[] = "j.status = ?";
        $params[] = $status;
    }

    if (!empty($conditions)) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " ORDER BY j.tanggal ASC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $jadwalList = $stmt->fetchAll();

    foreach ($jadwalList as &$j) {
        if ($j['bukti']) {
            $j['bukti'] = json_decode($j['bukti'], true);
        } else {
            $j['bukti'] = [];
        }
    }

    jsonResponse(['success' => true, 'data' => $jadwalList]);
}

function handlePost() {
    requireAuth(['admin']);
    $data = getRequestBody();
    $db = getDB();

    $tanggal = $data['tanggal'] ?? null;

    if (!$tanggal) {
        jsonResponse(['success' => false, 'message' => 'Tanggal harus diisi'], 400);
    }

    try {
        $stmt = $db->prepare("INSERT INTO jadwal (tanggal, status) VALUES (?, 'pending')");
        $stmt->execute([$tanggal]);
        $jadwalId = $db->lastInsertId();

        jsonResponse([
            'success' => true,
            'message' => 'Jadwal berhasil ditambahkan',
            'data' => ['id' => (int)$jadwalId]
        ], 201);
    } catch (PDOException $e) {
        if ($e->errorInfo[1] == 1062) {
            jsonResponse(['success' => false, 'message' => 'Jadwal untuk tanggal ini sudah ada'], 400);
        }
        jsonResponse(['success' => false, 'message' => 'Gagal menambah jadwal'], 500);
    }
}

function handlePut() {
    $user = requireAuth(['petugas', 'admin']);
    $id = $_GET['id'] ?? null;

    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'ID diperlukan'], 400);
    }

    $data = getRequestBody();
    $status = $data['status'] ?? null;

    if (!$status || !in_array($status, ['pending', 'submitted', 'verified', 'rejected'])) {
        jsonResponse(['success' => false, 'message' => 'Status tidak valid'], 400);
    }

    $db = getDB();

    // If petugas, update status to submitted and add bukti
    if ($user['role'] === 'petugas') {
        if ($status !== 'submitted') {
            jsonResponse(['success' => false, 'message' => 'Petugas hanya dapat mengubah status menjadi submitted'], 403);
        }
        $bukti = isset($data['bukti']) ? json_encode($data['bukti']) : null;
        $keterangan = $data['keterangan'] ?? null;
        $completed_by = $user['id'];
        
        $stmt = $db->prepare("UPDATE jadwal SET status = ?, bukti = ?, keterangan = ?, completed_by = ? WHERE id = ?");
        $stmt->execute([$status, $bukti, $keterangan, $completed_by, $id]);
    } else {
        // Admin verification
        $stmt = $db->prepare("UPDATE jadwal SET status = ? WHERE id = ?");
        $stmt->execute([$status, $id]);
    }

    if ($stmt->rowCount() > 0) {
        jsonResponse(['success' => true, 'message' => 'Jadwal berhasil diperbarui']);
    } else {
        jsonResponse(['success' => false, 'message' => 'Jadwal tidak ditemukan atau tidak ada perubahan'], 404);
    }
}
