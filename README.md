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
# Using make
make dev

# Or using docker compose directly
docker compose -f docker-compose.dev.yml up
```

### 3. Access the application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:3001/api |
| Mongo Express | http://localhost:8081 |

## Common Commands

```bash
make dev              # Start with logs
make up               # Start in background
make down             # Stop all services
make logs             # View all logs
make logs-backend     # Backend logs only
make logs-frontend    # Frontend logs only
make shell-backend    # Shell into backend container
make shell-frontend   # Shell into frontend container
make db-shell         # MongoDB shell
make clean            # Remove containers and volumes
```

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
