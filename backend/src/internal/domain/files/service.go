package files

import "fairlance/internal/domain/files/blobs"

type FileService interface {
	UploadFile(name string, size int64, mimeType string, data []byte) (uint, error)
	DownloadFile(fileID uint) ([]byte, FileMetadata, error)
	DeleteFile(fileID uint) error
}

type fileService struct {
	fileRepo FileRepository
	blobSvc  blobs.BlobService
}

func NewFileService(fileRepo FileRepository, blobSvc blobs.BlobService) FileService {
	return &fileService{
		fileRepo: fileRepo,
		blobSvc:  blobSvc,
	}
}

func (s *fileService) UploadFile(name string, size int64, mimeType string, data []byte) (uint, error) {
	blobID, err := s.blobSvc.StoreBlob(data)
	if err != nil {
		return 0, err
	}
	file := &File{
		Name:     name,
		Size:     size,
		MimeType: mimeType,
		BlobId:   blobID,
	}
	return s.fileRepo.CreateFile(file)
}

func (s *fileService) DownloadFile(fileID uint) ([]byte, FileMetadata, error) {
	file, err := s.fileRepo.GetFileByID(fileID)
	if err != nil {
		return nil, FileMetadata{}, err
	}
	if file == nil {
		return nil, FileMetadata{}, nil
	}
	data, err := s.blobSvc.RetrieveBlob(file.BlobId)
	if err != nil {
		return nil, FileMetadata{}, err
	}
	metadata := FileMetadata{
		ID:       file.ID,
		FileName: file.Name,
		MimeType: file.MimeType,
	}
	return data, metadata, nil
}

func (s *fileService) DeleteFile(fileID uint) error {
	return s.fileRepo.DeleteFile(fileID)
}
