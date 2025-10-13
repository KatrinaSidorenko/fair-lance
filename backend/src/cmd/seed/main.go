package main

import (
	"log"

	"fairlance/configs"
	"fairlance/internal/db"
	"fairlance/internal/db/seed"
)

func main() {
	cfg, err := configs.Load()
	if err != nil {
		log.Fatal("config load error:", err)
	}

	database, err := db.Connect(cfg)
	if err != nil {
		log.Fatal("db connect error:", err)
	}

	log.Println("Starting database seeding...")
	if err := seed.SeedDatabase(database, cfg.AdminPassword); err != nil {
		log.Fatal("seed error:", err)
	}

	log.Println("Database seeding completed successfully!")
}
