package db

import (
	"context"
    "fmt"
    "log"
    "time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"fairlance/configs"
)

func Connect(cfg *configs.Config) (*gorm.DB, error) {
	dsn := cfg.PostgresDSN()

	gormConfig := &gorm.Config{
        // adjust logger level in dev/prod
        Logger: logger.Default.LogMode(logger.Info),
    }

	db, err := gorm.Open(postgres.Open(dsn), gormConfig)
    if err != nil {
        return nil, fmt.Errorf("gorm open: %w", err)
    }

	sqlDB, err := db.DB()
    if err != nil {
        return nil, fmt.Errorf("getting sql.DB: %w", err)
    }

    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := sqlDB.PingContext(ctx); err != nil {
        return nil, fmt.Errorf("ping db: %w", err)
    }

    sqlDB.SetMaxOpenConns(cfg.DBMaxOpenConns)
    sqlDB.SetMaxIdleConns(cfg.DBMaxIdleConns)
    sqlDB.SetConnMaxLifetime(cfg.ConnMaxLifetime())

    log.Printf("connected to db: %s:%d/%s", cfg.DBHost, cfg.DBPort, cfg.DBName)
    return db, nil
}