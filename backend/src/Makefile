.PHONY: dev build debug
dev:
	air -c .air.toml

build:
	go build -o bin/api ./cmd/api/main.go

debug:
	dlv debug ./cmd/api --headless --listen=:40000 --api-version=2 --log
