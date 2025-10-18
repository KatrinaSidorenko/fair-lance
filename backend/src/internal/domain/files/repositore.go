package files

import "gorm.io/gorm"

// todo: maybe will be better don't use repository pattern due the orm capabilities
type FileRepository interface {
	CreateFile(file *File) (uint, error)
	GetFileByID(fileID uint) (*File, error)
	DeleteFile(fileID uint) error
}

type fileRepository struct {
	db *gorm.DB
}

func NewFileRepository(db *gorm.DB) FileRepository {
	return &fileRepository{db: db}
}

func (r *fileRepository) CreateFile(file *File) (uint, error) {
	if err := r.db.Create(file).Error; err != nil {
		return 0, err
	}
	return file.ID, nil
}

func (r *fileRepository) GetFileByID(fileID uint) (*File, error) {
	var file File
	if err := r.db.First(&file, fileID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	return &file, nil
}

func (r *fileRepository) DeleteFile(fileID uint) error {
	if err := r.db.Delete(&File{}, fileID).Error; err != nil {
		return err
	}
	return nil
}
