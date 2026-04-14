<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=sipares', 'root', '');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("
        CREATE TABLE transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            bulan VARCHAR(30) NOT NULL,
            jumlah INT NOT NULL DEFAULT 25000,
            tanggal DATE NOT NULL,
            status ENUM('pending','verified','rejected') NOT NULL DEFAULT 'pending',
            bukti VARCHAR(255) DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB;
    ");
    echo "Success!\n";
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
