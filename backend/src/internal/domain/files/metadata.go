package files

type FileMetadata struct {
	ID       uint   `json:"id" gorm:"primaryKey;autoIncrement"`
	FileName string `json:"file_name" gorm:"not null"`
	MimeType string `json:"mime_type" gorm:"not null"`
}