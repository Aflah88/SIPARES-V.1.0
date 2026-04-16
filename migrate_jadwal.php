<?php
require_once __DIR__ . '/api/config.php';
$db = getDB();
try {
    $db->exec("ALTER TABLE jadwal ADD COLUMN keterangan TEXT DEFAULT NULL AFTER bukti");
    echo "Success";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
