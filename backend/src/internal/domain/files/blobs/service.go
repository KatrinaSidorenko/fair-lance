package blobs

import (
	"gorm.io/gorm"
)

type BlobService interface {
	StoreBlob(data []byte) (uint, error)
	RetrieveBlob(blobID uint) ([]byte, error)
}

type blobService struct {
	db *gorm.DB
}

func NewBlobService(db *gorm.DB) BlobService {
	return &blobService{db: db}
}

func (s *blobService) StoreBlob(data []byte) (uint, error) {
	compressedData, err := CompressData(data)
	if err != nil {
		return 0, err
	}
	blob := &Blob{
		Content: compressedData,
	}

	if err := s.db.Create(blob).Error; err != nil {
		return 0, err
	}
	return blob.ID, nil
}

func (s *blobService) RetrieveBlob(blobID uint) ([]byte, error) {
	var blob Blob
	if err := s.db.First(&blob, blobID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, err
	}
	decompressedData, err := DecompressData(blob.Content)
	if err != nil {
		return nil, err
	}
	return decompressedData, nil
}
