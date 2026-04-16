<?php
require_once __DIR__ . '/api/config.php';
$db = getDB();

try {
    $db->exec("CREATE TABLE IF NOT EXISTS complaints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        subjek VARCHAR(150) NOT NULL,
        pesan TEXT NOT NULL,
        status ENUM('pending','ditanggapi','selesai') NOT NULL DEFAULT 'pending',
        balasan TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB");
    echo "Table 'complaints' created successfully!\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
