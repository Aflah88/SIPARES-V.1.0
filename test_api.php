<?php
$ch = curl_init('http://localhost:8080/D1/api/auth.php?action=login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['username'=>'ahmad','password'=>'user123','role'=>'user']));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
echo "HTTP $httpCode: $response";
curl_close($ch);
