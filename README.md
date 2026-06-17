# Controll Room — Backend

Backend CCTV monitoring. Laravel 13 + Filament 5 + PostgreSQL.

## Tech Stack

| Komponen     | Versi |
| ------------ | ----- |
| PHP          | 8.3+  |
| Laravel      | 13.x  |
| Filament     | 5.x   |
| PostgreSQL   | 15+   |
| Tailwind CSS | 4.x   |
| Vite         | 8.x   |

## Requirements

- PHP 8.3+ (extensions: `pgsql`, `mbstring`, `openssl`, `tokenizer`, `xml`, `ctype`, `json`)
- PostgreSQL 15+
- Composer
- Node.js + NPM (untuk frontend build)
- Supervisor / systemd (untuk queue worker)

## Quick Start

```bash
# Clone & install
composer install
npm install

# Environment
cp .env.example .env
php artisan key:generate

# Database (pastikan PostgreSQL sudah running)
php artisan migrate

# Build frontend
npm run build
```

Atau satu command:

```bash
composer setup
```

## Development

```bash
# Jalankan semua service sekaligus (Server + Queue + Logs + Vite)
composer dev
```

Service yang jalan:
| Service | Fungsi |
|---|---|
| `server` | `php artisan serve` — HTTP server |
| `queue` | `php artisan queue:listen` — Queue worker |
| `logs` | `php artisan pail` — Real-time log viewer |
| `vite` | `npm run dev` — Vite HMR |

Atau manual:

```bash
php artisan serve          # server
php artisan queue:listen   # queue worker
php artisan pail           # log viewer
npm run dev                # Vite HMR
```

## Docker

Project menyediakan Docker Compose untuk PostgreSQL saja (bukan full-stack):

```bash
# Jalankan PostgreSQL via Docker
docker compose up -d

# Cek status
docker compose ps
```

Konfigurasi di `docker-compose.yml`:

- Image: `postgres:15-alpine`
- Port: `5432`
- Volume: `cctv_pg_data` (persistent)

Pastikan `.env` cocok dengan konfigurasi Docker:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=cctv_db
DB_USERNAME=cctv
DB_PASSWORD=your_password
```

## Deployment

### 1. Environment Production

Ubah di `.env`:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://domain-anda.com
LOG_LEVEL=warning
```

### 2. Optimization

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan filament:cache-components
```

### 3. Scheduler (Auto-Recovery CCTV)

> **WAJIB.** Tanpa ini CCTV offline tidak akan otomatis online.

Tambahkan cron job di server:

```cron
* * * * * cd /path/ke/project && php artisan schedule:run >> /dev/null 2>&1
```

Cara pasang:

```bash
crontab -e
# lalu tambahkan baris di atas
```

### 4. Queue Worker

```bash
# Pastikan queue worker jalan (via Supervisor atau systemd)
php artisan queue:work --tries=3
```

### 5. Web Server

Arahkan document root ke `public/` dan pastikan URL rewriting aktif.

### 6. Railway

Project sudah terkonfigurasi untuk deploy ke Railway via Nixpacks.

`railway.toml`:

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "php artisan migrate --force && php artisan config:cache && ..."
healthcheckPath = "/up"

[process.web]
command = "php artisan serve --host=0.0.0.0 --port=$PORT"

[process.queue]
command = "php artisan queue:work --sleep=3 --tries=3 --max-time=3600"
```

Deploy:

```bash
railway login
railway init
railway up
```

## Fitur

| Fitur                 | Keterangan                                                     |
| --------------------- | -------------------------------------------------------------- |
| **Filament Admin**    | Panel admin `/admin` untuk manage CCTV, user, pantau dashboard |
| **REST API**          | API untuk data CCTV, status, YouTube URL (auth via Sanctum)    |
| **Auto Health Check** | Cek stream YouTube tiap 30 menit via scheduler                 |
| **Auto-Recovery**     | CCTV offline otomatis jadi online jika stream kembali normal   |
| **API Documentation** | Docs otomatis via Scramble di `/docs/api`                      |

## API Endpoints

| Method | Endpoint                     | Auth | Keterangan                |
| ------ | ---------------------------- | ---- | ------------------------- |
| POST   | `/api/v1/auth/login`         | -    | Login, rate limit 5/menit |
| POST   | `/api/v1/auth/logout`        | ✅   | Logout                    |
| GET    | `/api/v1/auth/me`            | ✅   | Profil user aktif         |
| GET    | `/api/v1/cctvs`              | -    | List semua CCTV           |
| GET    | `/api/v1/cctvs/map`          | -    | Data CCTV untuk peta      |
| GET    | `/api/v1/cctvs/{id}`         | -    | Detail satu CCTV          |
| POST   | `/api/v1/cctvs`              | ✅   | Tambah CCTV               |
| PATCH  | `/api/v1/cctvs/{id}`         | ✅   | Update CCTV               |
| DELETE | `/api/v1/cctvs/{id}`         | ✅   | Hapus CCTV                |
| PATCH  | `/api/v1/cctvs/{id}/status`  | ✅   | Update status CCTV        |
| POST   | `/api/v1/cctvs/{id}/youtube` | ✅   | Update YouTube URL        |
| GET    | `/api/v1/users`              | ✅   | List user                 |
| POST   | `/api/v1/users`              | ✅   | Tambah user               |
| GET    | `/api/v1/users/{id}`         | ✅   | Detail user               |
| PATCH  | `/api/v1/users/{id}`         | ✅   | Update user               |
| DELETE | `/api/v1/users/{id}`         | ✅   | Hapus user                |

Auth: Bearer token via Laravel Sanctum.

## Project Structure

```
app/
├── Actions/          # Business logic actions
├── Console/          # Artisan commands
├── Enums/            # CctvStatus, AssetCategory
├── Filament/         # Admin panel (Resources, Pages, Widgets)
├── Http/
│   ├── Controllers/
│   │   └── Api/      # Auth, Cctv, User controllers
│   └── ...
├── Models/           # Cctv, User
├── Providers/        # Service providers
└── Services/         # YoutubeLiveService

database/
├── migrations/       # Schema migrations
├── factories/        # Model factories
└── seeders/          # Database seeders

routes/
├── api.php           # API routes (v1)
├── web.php           # Web routes
└── console.php       # Console routes
```

## Scheduler Commands

| Command              | Jadwal          | Fungsi                                        |
| -------------------- | --------------- | --------------------------------------------- |
| `cctv:check-streams` | Setiap 30 menit | Cek health stream YouTube, update status CCTV |

## Testing

```bash
composer test
```

Atau:

```bash
php artisan test
```
