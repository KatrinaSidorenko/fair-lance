package main

import (
	"log"

	"fairlance/configs"
	"fairlance/internal/db"
	"fairlance/internal/domain/users"

	"github.com/gin-gonic/gin"
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

	userRepo := users.NewUserRepository(database)
	userService := users.NewUserService(userRepo)
	userHandler := users.NewUserHandler(userService, database)

	r := gin.Default()
	users.RegisterUserRoutes(r, userHandler)

	// todo: take port from configs + shutdown gracefully
	r.Run(":8080")
}
