# File Storage System - Makefile
# Common commands for Docker development

.PHONY: help dev build up down logs clean restart ps shell-backend shell-frontend db-shell test

# Default target
help:
	@echo "File Storage System - Docker Commands"
	@echo ""
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make restart      - Restart all services"
	@echo ""
	@echo "Build:"
	@echo "  make build        - Build all Docker images"
	@echo "  make build-prod   - Build production images"
	@echo ""
	@echo "Logs:"
	@echo "  make logs         - View logs from all services"
	@echo "  make logs-backend - View backend logs"
	@echo "  make logs-frontend- View frontend logs"
	@echo ""
	@echo "Shell Access:"
	@echo "  make shell-backend  - Open shell in backend container"
	@echo "  make shell-frontend - Open shell in frontend container"
	@echo "  make db-shell       - Open MongoDB shell"
	@echo ""
	@echo "Maintenance:"
	@echo "  make ps           - List running containers"
	@echo "  make clean        - Remove containers, volumes, and images"
	@echo "  make clean-volumes- Remove only volumes (data loss!)"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-down    - Stop production environment"

# Development
dev:
	docker compose up

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

# Build
build:
	docker compose build

build-prod:
	docker compose -f docker-compose.prod.yml build

# Logs
logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-frontend:
	docker compose logs -f frontend

logs-mongo:
	docker compose logs -f mongo

# Shell access
shell-backend:
	docker compose exec backend sh

shell-frontend:
	docker compose exec frontend sh

db-shell:
	docker compose exec mongo mongosh -u root -p example

# Status
ps:
	docker compose ps

# Maintenance
clean:
	docker compose down -v --rmi all --remove-orphans

clean-volumes:
	docker compose down -v

# Production
prod:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

# Testing
test:
	docker compose exec backend npm test

test-frontend:
	docker compose exec frontend npm test
