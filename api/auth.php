<?php
/* ===================================
   SIPARES - Authentication API
   =================================== */
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'session':
        handleSession();
        break;
    default:
        jsonResponse(['success' => false, 'message' => 'Invalid action'], 400);
}

function handleLogin() {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
    }

    $data = getRequestBody();
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    $role = $data['role'] ?? '';

    if (empty($username) || empty($password) || empty($role)) {
        jsonResponse(['success' => false, 'message' => 'Username, password, dan role harus diisi'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM users WHERE username = ? AND role = ?");
    $stmt->execute([$username, $role]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        jsonResponse(['success' => false, 'message' => 'Username atau password salah'], 401);
    }

    // Remove password from session data
    unset($user['password']);

    $_SESSION['user'] = $user;

    jsonResponse([
        'success' => true,
        'message' => 'Login berhasil',
        'data' => $user
    ]);
}

function handleLogout() {
    session_destroy();
    jsonResponse(['success' => true, 'message' => 'Logout berhasil']);
}

function handleSession() {
    if (isset($_SESSION['user'])) {
        jsonResponse(['success' => true, 'data' => $_SESSION['user']]);
    } else {
        jsonResponse(['success' => false, 'message' => 'Not authenticated'], 401);
    }
}
