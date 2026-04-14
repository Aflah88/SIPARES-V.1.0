<?php
/* ===================================
   SIPARES - Database Configuration
   =================================== */

// Start session for all API calls
session_start();

// CORS Headers (for local development)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
define('DB_HOST', 'localhost');
define('DB_NAME', 'sipares');
define('DB_USER', 'root');
define('DB_PASS', '');

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
            exit;
        }
    }
    return $pdo;
}

// Helper: send JSON response
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper: get JSON body from request
function getRequestBody() {
    $body = file_get_contents('php://input');
    return json_decode($body, true) ?? [];
}

// Helper: require authentication
function requireAuth($allowedRoles = []) {
    if (!isset($_SESSION['user'])) {
        jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
    }
    if (!empty($allowedRoles) && !in_array($_SESSION['user']['role'], $allowedRoles)) {
        jsonResponse(['success' => false, 'message' => 'Forbidden'], 403);
    }
    return $_SESSION['user'];
}
