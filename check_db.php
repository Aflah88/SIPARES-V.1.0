<?php
try {
    $pdo = new PDO('mysql:host=localhost;dbname=sipares', 'root', '');
    $stmt = $pdo->query('SHOW TABLES');
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        echo $row[0] . "\n";
    }
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
