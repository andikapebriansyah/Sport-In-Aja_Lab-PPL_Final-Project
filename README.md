# Sport-In Aja - Sistem Manajemen Fasilitas Olahraga

Aplikasi manajemen fasilitas olahraga berbasis web yang dibangun menggunakan AdonisJS.

## Prasyarat

- Node.js v16.x.x (LTS)
  ```bash
  # Untuk Windows, install nvm-windows dari:
  # https://github.com/coreybutler/nvm-windows/releases
  
  # Setelah install nvm, jalankan:
  nvm install 16.20.0
  nvm use 16.20.0
  ```

- MySQL 8.0 atau yang lebih baru
- Git

## Instalasi

1. Clone repositori
   ```bash
   git clone https://github.com/username/sport-inaja.git
   cd sport-inaja
   ```

2. Install dependensi
   ```bash
   npm install
   ```

3. Setup environment
   ```bash
   # Copy file .env.example
   cp .env.example .env
   
   # Generate app key
   node ace generate:key
   ```

4. Konfigurasi database di file .env:
   ```env
   DB_CONNECTION=mysql
   MYSQL_HOST=localhost
   MYSQL_PORT=3306
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DB_NAME=sport_inaja
   ```

5. Install dan konfigurasi Lucid ORM
   ```bash
   npm i @adonisjs/lucid
   node ace configure @adonisjs/lucid
   ```

6. Install dan konfigurasi Auth
   ```bash
   npm i @adonisjs/auth
   node ace configure @adonisjs/auth
   ```

7. Jalankan migrasi database
   ```bash
   # Buat database terlebih dahulu
   mysql -u root -p
   CREATE DATABASE sport_inaja;
   exit
   
   # Jalankan migrasi
   node ace migration:run
   
   # Isi data awal
   node ace db:seed
   ```

## Menjalankan Aplikasi

1. Mode Development
   ```bash
   node ace serve --watch
   ```
   Aplikasi akan berjalan di http://localhost:3333

2. Mode Production
   ```bash
   # Build aplikasi
   node ace build --production
   
   # Jalankan aplikasi
   cd build
   node server.js
   ```

## Akun Default

1. Admin
   - Email: admin@example.com
   - Password: admin123

2. User
   - Email: andika@example.com
   - Password: password123

## Struktur Folder

```
.
├── app/                    # Kode utama aplikasi
│   ├── Controllers/       # Controller
│   ├── Models/           # Model database
│   ├── Middleware/       # Middleware
│   └── Validators/       # Validator form
├── config/               # File konfigurasi
├── database/            
│   ├── migrations/      # Migrasi database
│   └── seeders/        # Seeder database
├── public/              # Asset publik
├── resources/
│   └── views/          # File view
├── start/              # File startup
└── tests/              # Unit test
```

## Fitur

1. Autentikasi
   - Login
   - Register
   - Logout
   - Role based access (Admin & User)

2. Admin
   - Manajemen User
   - Manajemen Lapangan
   - Manajemen Booking
   - Profile Settings

3. User
   - Booking Lapangan
   - Lihat History Booking
   - Profile Settings

## Teknologi

- AdonisJS 5
- MySQL
- Tailwind CSS
- Alpine.js

## Troubleshooting

1. Error Node.js version
   ```bash
   # Install nvm (Node Version Manager)
   # Windows: https://github.com/coreybutler/nvm-windows
   # Linux/Mac: https://github.com/nvm-sh/nvm
   
   # Switch ke Node.js v16
   nvm install 16.20.0
   nvm use 16.20.0
   ```

2. Error MySQL Connection
   - Pastikan MySQL server berjalan
   - Periksa kredensial di .env
   - Pastikan database sudah dibuat

3. Error EADDRINUSE
   ```bash
   # Kill proses yang menggunakan port 3333
   # Windows
   netstat -ano | findstr :3333
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -i :3333
   kill -9 <PID>
   ```

## Pengembangan

1. Membuat controller baru
   ```bash
   node ace make:controller NamaController
   ```

2. Membuat model baru
   ```bash
   node ace make:model NamaModel
   ```

3. Membuat migrasi baru
   ```bash
   node ace make:migration nama_tabel
   ```

## Lisensi

MIT License 
