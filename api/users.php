<?php
/* ===================================
   SIPARES - Users CRUD API
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
    case 'DELETE':
        handleDelete();
        break;
    default:
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

function handleGet() {
    requireAuth(['admin']);
    $db = getDB();

    $role = $_GET['role'] ?? null;
    $id = $_GET['id'] ?? null;

    if ($id) {
        $stmt = $db->prepare("SELECT id, nama, username, phone, rt, rw, alamat, role, created_at FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch();
        if ($user) {
            jsonResponse(['success' => true, 'data' => $user]);
        } else {
            jsonResponse(['success' => false, 'message' => 'User not found'], 404);
        }
    }

    $sql = "SELECT id, nama, username, phone, rt, rw, alamat, role, created_at FROM users";
    $params = [];

    if ($role) {
        $sql .= " WHERE role = ?";
        $params[] = $role;
    }

    $sql .= " ORDER BY id ASC";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $users = $stmt->fetchAll();

    jsonResponse(['success' => true, 'data' => $users]);
}

function handlePost() {
    requireAuth(['admin']);
    $data = getRequestBody();
    $db = getDB();

    $nama = $data['nama'] ?? '';
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $phone = $data['phone'] ?? null;
    $rt = $data['rt'] ?? null;
    $rw = $data['rw'] ?? null;
    $alamat = $data['alamat'] ?? null;
    $role = $data['role'] ?? 'user';

    if (empty($nama) || empty($username) || empty($password)) {
        jsonResponse(['success' => false, 'message' => 'Nama, username, dan password harus diisi'], 400);
    }

    // Check duplicate username
    $check = $db->prepare("SELECT id FROM users WHERE username = ?");
    $check->execute([$username]);
    if ($check->fetch()) {
        jsonResponse(['success' => false, 'message' => 'Username sudah digunakan'], 400);
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("INSERT INTO users (nama, username, password, phone, rt, rw, alamat, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nama, $username, $hashedPassword, $phone, $rt, $rw, $alamat, $role]);

    $newId = $db->lastInsertId();

    jsonResponse([
        'success' => true,
        'message' => 'User berhasil ditambahkan',
        'data' => ['id' => (int)$newId, 'nama' => $nama, 'username' => $username, 'phone' => $phone, 'rt' => $rt, 'rw' => $rw, 'alamat' => $alamat, 'role' => $role]
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

    if (isset($data['nama'])) { $fields[] = "nama = ?"; $params[] = $data['nama']; }
    if (isset($data['phone'])) { $fields[] = "phone = ?"; $params[] = $data['phone']; }
    if (isset($data['rt'])) { $fields[] = "rt = ?"; $params[] = $data['rt']; }
    if (isset($data['rw'])) { $fields[] = "rw = ?"; $params[] = $data['rw']; }
    if (isset($data['alamat'])) { $fields[] = "alamat = ?"; $params[] = $data['alamat']; }
    if (!empty($data['password'])) {
        $fields[] = "password = ?";
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }

    if (empty($fields)) {
        jsonResponse(['success' => false, 'message' => 'Tidak ada data untuk diupdate'], 400);
    }

    $params[] = $id;
    $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    jsonResponse(['success' => true, 'message' => 'User berhasil diperbarui']);
}

function handleDelete() {
    requireAuth(['admin']);
    $id = $_GET['id'] ?? null;

    if (!$id) {
        jsonResponse(['success' => false, 'message' => 'ID diperlukan'], 400);
    }

    $db = getDB();

    // Prevent deleting own account
    if ($_SESSION['user']['id'] == $id) {
        jsonResponse(['success' => false, 'message' => 'Tidak dapat menghapus akun sendiri'], 400);
    }

    $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
    $stmt->execute([$id]);

    if ($stmt->rowCount() > 0) {
        jsonResponse(['success' => true, 'message' => 'User berhasil dihapus']);
    } else {
        jsonResponse(['success' => false, 'message' => 'User tidak ditemukan'], 404);
    }
}
