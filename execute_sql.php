<?php
$host = 'localhost';
$user = 'root';
$pass = '';

$pdo = new PDO("mysql:host=$host;charset=utf8mb4", $user, $pass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$sqlFile = __DIR__ . '/database.sql';
$sql = file_get_contents($sqlFile);

$queries = explode(";", $sql);
foreach ($queries as $i => $q) {
    $q = trim($q);
    if (!empty($q)) {
        try {
            $pdo->exec($q);
        } catch (PDOException $e) {
            echo "Error executing query $i: " . $e->getMessage() . "\nQuery: " . substr($q, 0, 100) . "...\n";
            exit(1);
        }
    }
}
echo "All queries successful.\n";
