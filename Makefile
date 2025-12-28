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
	docker compose -f docker-compose.dev.yml up

up:
	docker compose -f docker-compose.dev.yml up -d

down:
	docker compose -f docker-compose.dev.yml down

restart:
	docker compose -f docker-compose.dev.yml restart

# Build
build:
	docker compose -f docker-compose.dev.yml build

build-prod:
	docker compose -f docker-compose.prod.yml build

# Logs
logs:
	docker compose -f docker-compose.dev.yml logs -f

logs-backend:
	docker compose -f docker-compose.dev.yml logs -f backend

logs-frontend:
	docker compose -f docker-compose.dev.yml logs -f frontend

logs-mongo:
	docker compose -f docker-compose.dev.yml logs -f mongo

# Shell access
shell-backend:
	docker compose -f docker-compose.dev.yml exec backend sh

shell-frontend:
	docker compose -f docker-compose.dev.yml exec frontend sh

db-shell:
	docker compose -f docker-compose.dev.yml exec mongo mongosh -u root -p example

# Status
ps:
	docker compose -f docker-compose.dev.yml ps

# Maintenance
clean:
	docker compose -f docker-compose.dev.yml down -v --rmi all --remove-orphans

clean-volumes:
	docker compose -f docker-compose.dev.yml down -v

# Production
prod:
	docker compose -f docker-compose.prod.yml up -d

prod-down:
	docker compose -f docker-compose.prod.yml down

prod-logs:
	docker compose -f docker-compose.prod.yml logs -f

# Testing
test:
	docker compose -f docker-compose.dev.yml exec backend npm test

test-frontend:
	docker compose -f docker-compose.dev.yml exec frontend npm test
