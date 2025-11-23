package main

import (
	"context"
	"log"
	"time"

	"fairlance/configs"
	"fairlance/internal/auth"
	"fairlance/internal/db"

	"fairlance/internal/domain/escrow"
	"fairlance/internal/domain/events"
	jobapplications "fairlance/internal/domain/job_applications"
	"fairlance/internal/domain/jobs"
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
	userHandler := users.NewUserHandler(userService)

	// blobService := blobs.NewBlobService(database)
	// fileRepo := files.NewFileRepository(database)
	// fileService := files.NewFileService(fileRepo, blobService)

	jobRepo := jobs.NewJobRepository(database)
	jobService := jobs.NewJobService(jobRepo)
	jobHandler := jobs.NewJobHandler(jobService)

	jobApplicationRepo := jobapplications.NewJobApplicationRepository(database)
	jobApplicationService := jobapplications.NewJobApplicationService(jobApplicationRepo)
	jobApplicationHandler := jobapplications.NewJobApplicationHandler(jobApplicationService)

	eventsRepository := events.NewEventRepository(database)
	go escrow.StartEventListener(cfg, eventsRepository)
	// todo: configure this
	batchSize := 10
	interval := time.Second * 10
	go events.ProcessEvents(context.Background(), batchSize, interval, eventsRepository, jobRepo)

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	users.RegisterUserRoutes(r, userHandler, tokenManger)
	jobs.RegisterJobRoutes(r, jobHandler, tokenManger)
	jobapplications.RegisterJobApplicationRoutes(r.Group(""), jobApplicationHandler, tokenManger)
	// todo: take port from configs + shutdown gracefully
	// changed to 8085 to avoid local port conflict, sorry ^_^
	r.Run(":8085")
}
