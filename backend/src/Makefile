.PHONY: dev build debug migrate-up migrate-down migrate-create install-migrate seed

dev:
	air -c .air.toml

build:
	go build -o bin/api ./cmd/api/main.go

debug:
	dlv debug ./cmd/api --headless --listen=:40000 --api-version=2 --log

install-migrate:
	@echo "Installing golang-migrate..."
	go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

migrate-up:
	@echo "Running migrations..."
	migrate -path migrations -database "postgresql://postgres:postgres@localhost:5432/fairlance_dev?sslmode=disable" up

migrate-down:
	@echo "Rolling back migrations..."
	migrate -path migrations -database "postgresql://postgres:postgres@localhost:5432/fairlance_dev?sslmode=disable" down

migrate-create:
	@read -p "Enter migration name: " name; \
	migrate create -ext sql -dir migrations -seq $$name

seed:
	@echo "Seeding database..."
	go run cmd/seed/main.go
