# Docker Setup Guide

## Quick Start

### First Time Setup

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Start all services**:
   ```bash
   docker compose up
   ```

   Or using Make:
   ```bash
   make dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api
   - Mongo Express: http://localhost:8081

### Common Commands

```bash
# Start development environment
make dev              # With logs
make up               # In background

# View logs
make logs             # All services
make logs-backend     # Backend only
make logs-frontend    # Frontend only

# Stop services
make down

# Rebuild images
make build

# Clean everything (⚠️ removes data!)
make clean
```

## Development

### Hot Reload

Both backend and frontend support hot reload:
- Edit files in `backend/src/` → Backend auto-restarts
- Edit files in `frontend/app/` → Frontend auto-refreshes

### Database Access

**Mongo Express UI**: http://localhost:8081

**MongoDB Shell**:
```bash
make db-shell
```

**Shell Access**:
```bash
make shell-backend    # Backend container
make shell-frontend   # Frontend container
```

## Production Deployment

### Build Production Images

```bash
make build-prod
```

### Start Production Stack

```bash
make prod
```

### Environment Variables

Create `.env` file for production with:
```env
NODE_ENV=production
MONGODB_URI=mongodb://user:pass@mongo:27017/file-storage?authSource=admin
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
MONGO_ROOT_USERNAME=secure_user
MONGO_ROOT_PASSWORD=secure_password
```

### Nginx Configuration

Production uses Nginx reverse proxy on port 80:
- Frontend: `/`
- Backend API: `/api`, `/files`, `/share`
- Rate limiting enabled
- Gzip compression enabled

## Troubleshooting

### Port Already in Use

If ports 3000, 3001, or 27017 are in use:

1. Stop existing services:
   ```bash
   # Stop old MongoDB
   docker compose -f backend/docker-compose.yml down
   
   # Stop npm dev servers
   # Press Ctrl+C in terminals running npm
   ```

2. Or change ports in `.env`:
   ```env
   BACKEND_PORT=3002
   ```

### Permission Issues

On Linux/Mac, if you get permission errors:
```bash
sudo chown -R $USER:$USER uploads/
```

### Rebuild from Scratch

```bash
make clean
make build
make up
```

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│   Backend   │
│  (Next.js)  │     │  (NestJS)   │
│   :3000     │     │    :3001    │
└─────────────┘     └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   MongoDB   │
                    │    :27017   │
                    └─────────────┘
```

## File Structure

```
c:/DBD/
├── docker-compose.yml          # Development
├── docker-compose.prod.yml     # Production
├── .env                        # Your config (git-ignored)
├── .env.example                # Template
├── Makefile                    # Commands
├── docker/
│   ├── nginx/
│   │   └── nginx.conf         # Reverse proxy
│   └── mongo/
│       └── init.js            # DB initialization
├── backend/
│   ├── Dockerfile             # Production
│   ├── Dockerfile.dev         # Development
│   └── .dockerignore
└── frontend/
    ├── Dockerfile             # Production
    ├── Dockerfile.dev         # Development
    └── .dockerignore
```

## Next Steps

After Docker setup is complete:
- [ ] Stage 2: Configuration & Environment Variables
- [ ] Stage 3: Security (Authentication, JWT)
- [ ] Stage 4: Code Quality & Error Handling
- [ ] Stage 5: Testing

See `exploring-filestorage-project/IMPROVEMENTS.md` for full roadmap.
