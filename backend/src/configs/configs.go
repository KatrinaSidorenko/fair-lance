package configs

import (
	"fmt"
	"time"

	"github.com/joho/godotenv"
	"github.com/kelseyhightower/envconfig"
)

type Config struct {
	DBHost               string `envconfig:"DB_HOST" default:"localhost"`
	DBPort               int    `envconfig:"DB_PORT" default:"5432"`
	DBUser               string `envconfig:"DB_USER" default:"postgres"`
	DBPassword           string `envconfig:"DB_PASSWORD" default:"postgres"`
	DBName               string `envconfig:"DB_NAME" default:"myapp_dev"`
	DBSSLMode            string `envconfig:"DB_SSLMODE" default:"disable"`
	DBMaxOpenConns       int    `envconfig:"DB_MAX_OPEN_CONNS" default:"25"`
	DBMaxIdleConns       int    `envconfig:"DB_MAX_IDLE_CONNS" default:"25"`
	DBConnMaxLifetimeMin int    `envconfig:"DB_CONN_MAX_LIFETIME_MIN" default:"5"`
}

func Load() (*Config, error) {
	_ = godotenv.Load()
	var cfg Config
	if err := envconfig.Process("", &cfg); err != nil {
		return nil, err
	}
	return &cfg, nil
}

func (c *Config) PostgresDSN() string {
	return fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%d sslmode=%s",
		c.DBHost, c.DBUser, c.DBPassword, c.DBName, c.DBPort, c.DBSSLMode,
	)
}

func (c *Config) ConnMaxLifetime() time.Duration {
	return time.Duration(c.DBConnMaxLifetimeMin) * time.Minute
}
