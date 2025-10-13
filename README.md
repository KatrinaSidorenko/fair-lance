# Fair Lance

A modern freelance marketplace platform built with Go (Backend) and Next.js (Frontend).

## Quick Start

### 1. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d
```

### 2. Setup Backend

```bash
cd backend/src

# Run migrations
make migrate-up

# Seed the database (creates roles: employer, freelancer, admin)
make seed

# Start the backend server
go run cmd/api/main.go
```

Backend runs on `http://localhost:8085`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
bun install

# Start the development server
bun dev
```

Frontend runs on `http://localhost:3000`

## Default Credentials

After seeding, you can login with:

- **Email**: `admin@example.com`
- **Password**: `admin123` (or check your `ADMIN_PASSWORD` env var)

## Tech Stack

**Backend:**

- Go 1.25+
- Gin Web Framework
- GORM (PostgreSQL)
- JWT Authentication
- golang-migrate

**Frontend:**

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui

**Database:**

- PostgreSQL 16 (Docker)
