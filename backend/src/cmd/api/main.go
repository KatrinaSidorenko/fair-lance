package main

import (
	"log"

	"fairlance/configs"
	"fairlance/internal/auth"
	"fairlance/internal/db"

	"fairlance/internal/domain/users"

	"github.com/gin-contrib/cors"
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

	tokenManger := auth.NewJWTManager(cfg.JWTSecret)
	userRepo := users.NewUserRepository(database)
	userService := users.NewUserService(userRepo, tokenManger)
	userHandler := users.NewUserHandler(userService, database)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	users.RegisterUserRoutes(r, userHandler, tokenManger)

	// todo: take port from configs + shutdown gracefully
	// changed to 8085 to avoid local port conflict, sorry ^_^
	r.Run(":8085")
}
