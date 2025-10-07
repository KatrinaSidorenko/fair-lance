package seed

import (
	"fairlance/internal/domain/roles"
	"fairlance/internal/domain/users"
	"fmt"
	"log"

	"gorm.io/gorm"
)

func SeedDatabase(db *gorm.DB, adminPassword string) error {
	rolesToAdd := []roles.Role{
		{Name: "employer"},
		{Name: "freelancer"},
		{Name: "admin"},
	}

	for _, role := range rolesToAdd {
		var existing roles.Role
		err := db.Where("name = ?", role.Name).First(&existing).Error
		if err == gorm.ErrRecordNotFound {
			if err := db.Create(&role).Error; err != nil {
				return fmt.Errorf("failed to create role %s: %w", role.Name, err)
			}
			log.Printf("Created role: %s", role.Name)
		}
	}

	var admin users.User
	if err := db.Where("email = ?", "admin@example.com").First(&admin).Error; err == gorm.ErrRecordNotFound {
		var adminRole roles.Role
		if err := db.Where("name = ?", "admin").First(&adminRole).Error; err != nil {
			return fmt.Errorf("admin role not found: %w", err)
		}

		hashed, _ := users.HashPassword(adminPassword)
		admin = users.User{
			Username:     "admin",
			Email:        "admin@example.com",
			PasswordHash: hashed,
			RoleID:       adminRole.ID,
		}

		if err := db.Create(&admin).Error; err != nil {
			return fmt.Errorf("failed to create admin user: %w", err)
		}

		log.Println("Created admin user: admin@example.com (password: " + adminPassword + ")")
	}

	return nil
}
