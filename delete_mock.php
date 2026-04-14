<?php
$pdo = new PDO('mysql:host=localhost;dbname=sipares', 'root', '');
$pdo->exec("DELETE FROM transactions WHERE user_id = 2 AND bulan = 'April 2026'");
echo 'Deleted';
