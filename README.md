# Sentinel DMK — Backend

Backend CCTV monitoring untuk Kabupaten Demak. Laravel + Filament Admin + PostgreSQL.

## Requirements

- PHP 8.3+
- PostgreSQL 15+
- Composer
- Node.js + NPM (untuk frontend build)
- Supervisor (untuk queue worker)

## Setup

```bash
# 1. Clone & install dependencies
composer install
npm install

# 2. Environment
cp .env.example .env
php artisan key:generate

# 3. Database (pastikan PostgreSQL sudah running)
php artisan migrate

# 4. Frontend build
npm run build
```

## Development

```bash
# Jalankan semua service (Vite + Queue + Logs + Server)
php artisan dev
```

Atau manual:

```bash
php artisan serve          # server
php artisan queue:listen   # queue worker
npm run dev                # Vite HMR
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

## Fitur

| Fitur | Keterangan |
|---|---|
| **Filament Admin** | Panel admin `/admin` untuk manage CCTV, user, pantau dashboard |
| **API CCTV** | REST API untuk data CCTV, status, YouTube URL |
| **Auto Health Check** | Cek stream YouTube tiap 30 menit via scheduler |
| **Auto-Recovery** | CCTV offline otomatis jadi online jika stream kembali normal |

## API Docs

Akses `/docs/api` setelah server jalan.

## Scheduler Commands

| Command | Jadwal | Fungsi |
|---|---|---|
| `cctv:check-streams` | every 30 menit | Cek health stream YouTube, update status CCTV |
