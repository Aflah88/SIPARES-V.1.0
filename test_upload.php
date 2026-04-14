<?php
$cookieFile = __DIR__ . '/cookie.txt';

// Create dummy image
file_put_contents('dummy.png', base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='));

// Upload
$ch = curl_init('http://localhost:8080/D1/api/upload.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_COOKIEFILE, $cookieFile);

$cf = new CURLFile(__DIR__ . '/dummy.png', 'image/png', 'bukti_123.png');
$params = ['bukti' => $cf];
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Upload HTTP $httpCode: $response\n";
