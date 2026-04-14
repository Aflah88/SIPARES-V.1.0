<?php
/* ===================================
   SIPARES - Settings API
   =================================== */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'PUT':
        handlePut();
        break;
    default:
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

function handleGet() {
    // Both user, petugas, and admin can get settings (e.g., getting QRIS)
    requireAuth();
    $db = getDB();

    $key = $_GET['key'] ?? null;

    if ($key) {
        $stmt = $db->prepare("SELECT set_value FROM settings WHERE key_name = ?");
        $stmt->execute([$key]);
        $result = $stmt->fetch();
        if ($result) {
            jsonResponse(['success' => true, 'data' => $result['set_value']]);
        } else {
            jsonResponse(['success' => false, 'message' => 'Setting not found'], 404);
        }
    } else {
        $stmt = $db->query("SELECT * FROM settings");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll(PDO::FETCH_KEY_PAIR)]);
    }
}

function handlePut() {
    // Only admin can update settings
    requireAuth(['admin']);
    $data = getRequestBody();
    $db = getDB();

    $key = $data['key'] ?? null;
    $value = $data['value'] ?? '';

    if (!$key) {
        jsonResponse(['success' => false, 'message' => 'Key is required'], 400);
    }

    $stmt = $db->prepare("INSERT INTO settings (key_name, set_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE set_value = ?");
    $stmt->execute([$key, $value, $value]);

    jsonResponse(['success' => true, 'message' => 'Setting updated successfully']);
}
