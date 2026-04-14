<?php
/* ===================================
   SIPARES - Setup: Hash passwords & create DB
   Run this once: http://localhost/D1/api/setup.php
   =================================== */

header('Content-Type: text/html; charset=utf-8');

$host = 'localhost';
$user = 'root';
$pass = '';

echo "<h2>SIPARES Setup</h2>";

try {
    // Use mysqli for multi-query support
    $mysqli = new mysqli($host, $user, $pass);
    if ($mysqli->connect_error) {
        die("<p style='color:red'>❌ Connection failed: " . $mysqli->connect_error . "</p>");
    }

    // Read SQL file
    $sqlFile = __DIR__ . '/../database.sql';
    if (!file_exists($sqlFile)) {
        die("<p style='color:red'>❌ database.sql not found!</p>");
    }

    $sql = file_get_contents($sqlFile);

    // Execute multi-query
    if ($mysqli->multi_query($sql)) {
        // Process all results
        do {
            if ($result = $mysqli->store_result()) {
                $result->free();
            }
        } while ($mysqli->next_result());
    }

    if ($mysqli->error) {
        echo "<p style='color:red'>❌ SQL Error: " . $mysqli->error . "</p>";
    } else {
        echo "<p>✅ Database dan tabel berhasil dibuat</p>";
    }

    $mysqli->close();

    // Now connect with PDO to update passwords
    $pdo = new PDO("mysql:host=$host;dbname=sipares;charset=utf8mb4", $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);

    $passwords = [
        'admin' => 'admin123',
        'ahmad' => 'user123',
        'siti' => 'user123',
        'budi' => 'user123',
        'dewi' => 'user123',
        'eko' => 'user123',
        'joko' => 'petugas123',
        'sumarno' => 'petugas123',
    ];

    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE username = ?");
    foreach ($passwords as $username => $plainPassword) {
        $hashed = password_hash($plainPassword, PASSWORD_DEFAULT);
        $stmt->execute([$hashed, $username]);
        echo "<p>✅ Password untuk <strong>$username</strong> berhasil di-hash</p>";
    }

    // Create uploads directory
    $uploadsDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadsDir)) {
        mkdir($uploadsDir, 0777, true);
        echo "<p>✅ Folder uploads/ berhasil dibuat</p>";
    } else {
        echo "<p>✅ Folder uploads/ sudah ada</p>";
    }

    echo "<hr>";
    echo "<h3>🎉 Setup selesai!</h3>";
    echo "<p>Login credentials:</p>";
    echo "<table border='1' cellpadding='8' style='border-collapse:collapse; font-family:sans-serif;'>";
    echo "<tr><th>Role</th><th>Username</th><th>Password</th></tr>";
    echo "<tr><td>Admin</td><td>admin</td><td>admin123</td></tr>";
    echo "<tr><td>Warga</td><td>ahmad</td><td>user123</td></tr>";
    echo "<tr><td>Petugas</td><td>joko</td><td>petugas123</td></tr>";
    echo "</table>";
    echo "<p style='margin-top:16px'><a href='../index.html'>→ Buka Aplikasi</a></p>";

} catch (Exception $e) {
    echo "<p style='color:red'>❌ Error: " . $e->getMessage() . "</p>";
}
