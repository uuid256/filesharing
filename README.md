# File Storage System

A full-stack file management application with upload, folder organization, trash, and file sharing capabilities.

## Tech Stack

- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** NestJS, Mongoose
- **Database:** MongoDB 7

## Prerequisites

- Docker & Docker Compose
- Make (optional)

## Development Setup

### 1. Clone and configure

```bash
cp .env.example .env
```

### 2. Start all services

```bash
docker compose -f docker-compose.dev.yml up
```

> **Note for Windows users:** The `make` commands listed below do not work on Windows. Use the `docker compose` commands directly instead.

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| Mongo Express | http://localhost:8081 |

## Common Commands

| Action | Make (macOS/Linux) | Docker Compose (all platforms) |
|--------|-------------------|-------------------------------|
| Start with logs | `make dev` | `docker compose -f docker-compose.dev.yml up` |
| Start in background | `make up` | `docker compose -f docker-compose.dev.yml up -d` |
| Stop all services | `make down` | `docker compose -f docker-compose.dev.yml down` |
| View all logs | `make logs` | `docker compose -f docker-compose.dev.yml logs -f` |
| Backend logs | `make logs-backend` | `docker compose -f docker-compose.dev.yml logs -f backend` |
| Frontend logs | `make logs-frontend` | `docker compose -f docker-compose.dev.yml logs -f frontend` |
| Shell into backend | `make shell-backend` | `docker compose -f docker-compose.dev.yml exec backend sh` |
| Shell into frontend | `make shell-frontend` | `docker compose -f docker-compose.dev.yml exec frontend sh` |
| MongoDB shell | `make db-shell` | `docker compose -f docker-compose.dev.yml exec mongo mongosh -u root -p example` |
| Clean up | `make clean` | `docker compose -f docker-compose.dev.yml down -v --rmi all` |

## Project Structure

```
.
├── app/                  # Next.js frontend (App Router)
├── backend/              # NestJS backend API
│   └── src/
│       ├── files/        # File management module
│       ├── folders/      # Folder management module
│       └── share/        # File sharing module
├── docker/
│   ├── mongo/            # MongoDB initialization
│   └── nginx/            # Nginx config (production)
├── public/               # Static assets
└── docker-compose.dev.yml
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_ROOT_USERNAME` | root | MongoDB admin username |
| `MONGO_ROOT_PASSWORD` | example | MongoDB admin password |
| `BACKEND_PORT` | 3001 | Backend API port |
| `NEXT_PUBLIC_API_BASE_URL` | http://localhost:3001 | API URL for frontend |
