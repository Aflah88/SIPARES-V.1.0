-- ===================================
-- SIPARES Database Schema + Seed Data
-- ===================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS sipares;
SET FOREIGN_KEY_CHECKS = 1;
CREATE DATABASE sipares CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sipares;

-- ── Users (semua role) ──
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    rt VARCHAR(5) DEFAULT NULL,
    rw VARCHAR(5) DEFAULT NULL,
    alamat VARCHAR(255) DEFAULT NULL,
    role ENUM('admin','user','petugas') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Transactions ──
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

-- ── Jadwal Pengambilan Sampah (Global) ──
CREATE TABLE jadwal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL UNIQUE,
    status ENUM('pending','submitted','verified','rejected') NOT NULL DEFAULT 'pending',
    bukti TEXT DEFAULT NULL,
    completed_by INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (completed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Settings (Konfigurasi Global) ──
CREATE TABLE settings (
    key_name VARCHAR(50) PRIMARY KEY,
    set_value TEXT
) ENGINE=InnoDB;

-- ══════════════════════════════════════
-- DATA AWAL (SEEDING) 
-- ══════════════════════════════════════

-- Password: admin123, user123, petugas123 (hashed with password_hash)
-- Using PHP's PASSWORD_DEFAULT

-- Admin
INSERT INTO users (nama, username, password, role) VALUES
('Admin Utama', 'admin', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
-- password: password (placeholder, will be updated by setup)

-- Warga
INSERT INTO users (nama, username, password, phone, rt, rw, alamat, role) VALUES
('Ahmad Fauzi', 'ahmad', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081234567890', '03', '05', 'Jl. Melati No. 12', 'user'),
('Siti Nurhaliza', 'siti', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081298765432', '02', '05', 'Jl. Mawar No. 8', 'user'),
('Budi Santoso', 'budi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '085612348765', '01', '03', 'Jl. Dahlia No. 5', 'user'),
('Dewi Kartika', 'dewi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '087812345678', '04', '02', 'Jl. Kenanga No. 22', 'user'),
('Eko Prasetyo', 'eko', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081345678901', '03', '01', 'Jl. Anggrek No. 15', 'user');

-- Petugas Kebersihan
INSERT INTO users (nama, username, password, phone, role) VALUES
('Joko Widodo', 'joko', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081111222333', 'petugas'),
('Sumarno', 'sumarno', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '081444555666', 'petugas');

-- Transactions (user_id references the auto-increment IDs above)
-- Admin=1, Ahmad=2, Siti=3, Budi=4, Dewi=5, Eko=6, Joko=7, Sumarno=8
INSERT INTO transactions (user_id, bulan, jumlah, tanggal, status) VALUES
(2, 'Januari 2026', 25000, '2026-01-05', 'verified'),
(2, 'Februari 2026', 25000, '2026-02-03', 'verified'),
(2, 'Maret 2026', 25000, '2026-03-04', 'verified'),
(3, 'Januari 2026', 25000, '2026-01-10', 'verified'),
(3, 'Februari 2026', 25000, '2026-02-08', 'pending'),
(4, 'Januari 2026', 25000, '2026-01-15', 'verified'),
(4, 'Febrari 2026', 25000, '2026-02-12', 'rejected'),
(5, 'Maret 2026', 25000, '2026-03-07', 'pending'),
(6, 'Maret 2026', 25000, '2026-03-10', 'pending');

-- Jadwal (Global Schedule)
INSERT INTO jadwal (tanggal, status, completed_by) VALUES
('2026-04-11', 'pending', NULL),
('2026-04-12', 'pending', NULL),
('2026-04-13', 'pending', NULL),
('2026-04-09', 'verified', 7),
('2026-04-08', 'verified', 8);

-- Settings Global
INSERT INTO settings (key_name, set_value) VALUES
('qris_image', '');
