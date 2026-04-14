<?php
$pdo = new PDO('mysql:host=localhost;dbname=sipares', 'root', '');
$stmt = $pdo->query('SELECT count(*) FROM users');
echo 'Users: ' . $stmt->fetchColumn() . "\n";
$stmt = $pdo->query('SELECT count(*) FROM transactions');
echo 'Transactions: ' . $stmt->fetchColumn() . "\n";
