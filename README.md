# Nutrimate App - Backend API

Nutrimate adalah platform digital untuk ahli gizi berbasis workflow **ADIME (Assessment, Diagnosis, Intervention, Monitoring, and Evaluation)** (Nutrition Care Process). Aplikasi ini berfungsi sebagai *clinical operating system* untuk membantu analisis, diagnosis, intervensi, dan monitoring pasien secara terintegrasi.

## 🚀 Fitur Utama

- **Authentication & Authorization:** JWT-based authentication (Access & Refresh tokens).
- **User Management:** Registrasi dan manajemen profil pengguna/pasien.
- **Body Profile Tracking:** Pencatatan dan tracking profil tubuh pengguna (berat badan, tinggi badan, dsb) beserta riwayatnya.
- **Internal Bot Integration:** Endpoint khusus untuk integrasi dengan WhatsApp Bot (Baileys) untuk pengecekan nomor terdaftar dan operasional bot.
- **ADIME Workflow Support:** Mendukung alur kerja ahli gizi dari asesmen hingga evaluasi.
- **API Documentation:** Dokumentasi API interaktif menggunakan Swagger UI.

## 🛠️ Tech Stack

- **Framework:** [NestJS](https://nestjs.com/) (v11)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** Passport.js (JWT) & bcrypt
- **Validation:** class-validator & class-transformer
- **API Docs:** Swagger (`@nestjs/swagger`)

## ⚙️ Prasyarat

Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (v20 atau lebih baru direkomendasikan)
- [pnpm](https://pnpm.io/) (Package manager)
- [PostgreSQL](https://www.postgresql.org/)

## 📦 Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/Ibrahimad98/nutrimate-app.git
cd nutrimate-app
```

2. Install dependencies:
```bash
pnpm install
```

3. Setup Environment Variables:
Buat file `.env` di root folder dan konfigurasikan variabel berikut (sesuaikan dengan environment lokal Anda):
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=nutrimate_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d
```

4. Jalankan Migrasi & Seeding Database:
```bash
pnpm run migration:run
pnpm run seed
```

## 🚀 Menjalankan Aplikasi

```bash
# development
$ pnpm run start

# watch mode (direkomendasikan untuk development)
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## 📚 Dokumentasi API

Setelah aplikasi berjalan, dokumentasi API (Swagger) dapat diakses melalui browser pada endpoint yang telah ditentukan (biasanya di `/api` atau `/docs` tergantung konfigurasi bootstrap).

## 🗄️ CLI & Migrasi

Aplikasi ini menggunakan TypeORM. Perintah yang tersedia:
- `pnpm run migration:generate src/database/migrations/Name` - Membuat file migrasi baru dari perubahan entity
- `pnpm run migration:run` - Menjalankan migrasi ke database
- `pnpm run migration:revert` - Rollback migrasi terakhir

---
*Nutrimate - Empowering Nutritionists with Digital Solutions*
