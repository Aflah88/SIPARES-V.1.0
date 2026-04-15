# 🏗️ Class Diagram — SIPARES

**Sistem Pembayaran Retribusi Sampah**

---

## Diagram

```mermaid
classDiagram
    class Users {
        +int id PK
        +varchar nama
        +varchar username UK
        +varchar password
        +varchar phone
        +varchar rt
        +varchar rw
        +varchar alamat
        +enum role [admin, user, petugas]
        +timestamp created_at
    }

    class Transactions {
        +int id PK
        +int user_id FK
        +varchar bulan
        +int jumlah
        +date tanggal
        +enum status [pending, verified, rejected]
        +varchar bukti
        +timestamp created_at
    }

    class Jadwal {
        +int id PK
        +date tanggal UK
        +enum status [pending, submitted, verified, rejected]
        +text bukti
        +int completed_by FK
        +timestamp created_at
    }

    class Settings {
        +varchar key_name PK
        +text set_value
    }

    class AuthAPI {
        +handleLogin()
        +handleLogout()
        +handleSession()
    }

    class TransactionsAPI {
        +handleGet()
        +handlePost()
        +handlePut()
    }

    class JadwalAPI {
        +handleGet()
        +handlePost()
        +handlePut()
    }

    class UsersAPI {
        +handleGet()
        +handlePost()
        +handlePut()
        +handleDelete()
    }

    class SettingsAPI {
        +handleGet()
        +handlePut()
    }

    class UploadAPI {
        +handleUpload()
    }

    class ConfigHelper {
        +getDB() PDO
        +jsonResponse()
        +getRequestBody()
        +requireAuth()
    }

    class DataStore {
        -_session object
        +api(endpoint, options)
        +login(username, password, role)
        +logout()
        +checkSession()
        +getSession()
        +getUsers()
        +getPetugas()
        +getUserById(id)
        +addUser(userData)
        +updateUser(id, updates)
        +deleteUser(id)
        +getTransactions(filters)
        +addTransaction(data)
        +updateTransaction(id, updates)
        +getJadwal(filters)
        +updateJadwal(id, updates)
        +uploadBukti(file)
        +getSetting(key)
        +updateSetting(key, value)
        +formatCurrency(amount)
        +formatDate(dateStr)
    }

    class App {
        +init()
        +checkAuth()
        +renderLogin()
        +handleLogin(event)
        +renderDashboard()
        +toggleSidebar()
        +showModal()
        +closeModal()
        +showToast()
        +logout()
    }

    class UserModule {
        +currentSection string
        +uploadedFile File
        +getSidebarItems()
        +navigate(section)
        +renderContent()
        +renderDashboard()
        +renderBayar()
        +renderRiwayat()
        +renderProfil()
        +handleFileUpload(event)
        +submitPayment()
    }

    class PetugasModule {
        +currentSection string
        +uploadedFiles File[]
        +getSidebarItems()
        +navigate(section)
        +renderContent()
        +renderJadwal()
        +renderRiwayat()
        +confirmTask(jadwalId)
        +completeTask(jadwalId)
        +handleFileUpload(event)
    }

    class AdminModule {
        +currentSection string
        +getSidebarItems()
        +navigate(section)
        +renderContent()
        +renderVerify()
        +renderWarga()
        +renderPetugasManage()
        +renderLaporan()
        +renderJadwal()
        +renderSettings()
        +approvePayment(id)
        +rejectPayment(id)
        +saveWarga(event)
        +updateWarga(event, id)
        +deleteWarga(id)
        +savePetugas(event)
        +handleQrisUpload(event)
    }

    Users "1" --> "*" Transactions : user_id
    Users "1" --> "*" Jadwal : completed_by
    
    AuthAPI --> ConfigHelper : uses
    TransactionsAPI --> ConfigHelper : uses
    JadwalAPI --> ConfigHelper : uses
    UsersAPI --> ConfigHelper : uses
    SettingsAPI --> ConfigHelper : uses
    UploadAPI --> ConfigHelper : uses

    DataStore --> AuthAPI : calls
    DataStore --> TransactionsAPI : calls
    DataStore --> JadwalAPI : calls
    DataStore --> UsersAPI : calls
    DataStore --> SettingsAPI : calls
    DataStore --> UploadAPI : calls

    App --> DataStore : uses
    App --> UserModule : renders
    App --> PetugasModule : renders
    App --> AdminModule : renders

    UserModule --> DataStore : calls
    PetugasModule --> DataStore : calls
    AdminModule --> DataStore : calls
```

---

## Penjelasan Relasi

### Relasi Database (Entity)

| Relasi | Tipe | Keterangan |
|--------|------|------------|
| Users → Transactions | One-to-Many | Satu user (warga) bisa memiliki banyak transaksi. Foreign Key: `user_id` |
| Users → Jadwal | One-to-Many | Satu user (petugas) bisa menyelesaikan banyak jadwal. Foreign Key: `completed_by` |

### Relasi Backend (API Layer)

| Dari | Ke | Tipe | Keterangan |
|------|-----|------|------------|
| Semua API | ConfigHelper | Dependency | Semua API menggunakan helper untuk koneksi DB, auth, dan response |

### Relasi Frontend

| Dari | Ke | Tipe | Keterangan |
|------|-----|------|------------|
| App | DataStore | Dependency | App menggunakan DataStore untuk komunikasi API |
| App | UserModule / PetugasModule / AdminModule | Composition | App merender modul sesuai role user |
| UserModule / PetugasModule / AdminModule | DataStore | Dependency | Setiap modul memanggil DataStore untuk operasi data |
| DataStore | Semua API | Association | DataStore memanggil endpoint API via fetch() |
