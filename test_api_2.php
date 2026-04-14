<?php
$cookieFile = __DIR__ . '/cookie.txt';

// Login
$ch = curl_init('http://localhost:8080/D1/api/auth.php?action=login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['username'=>'ahmad','password'=>'user123','role'=>'user']));
curl_setopt($ch, CURLOPT_COOKIEJAR, $cookieFile);
$response = curl_exec($ch);
curl_close($ch);
echo "Login: " . $response . "\n";

// Add transaction (duplicate)
$ch = curl_init('http://localhost:8080/D1/api/transactions.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['bulan'=>'April 2026', 'jumlah'=>25000, 'tanggal'=>'2026-04-11', 'bukti'=>null]));
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "Add Trx HTTP $httpCode: " . $response . "\n";
