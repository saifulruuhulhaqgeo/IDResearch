package domains

import "context"

type CollectionFolder struct {
	ID          string `json:"id" gorm:"column:id"`
	Name        string `json:"name" gorm:"column:name"`
	Description string `json:"description" gorm:"column:description"`
	IsPublic    bool   `json:"is_public" gorm:"column:is_public"`
	UserID      string `json:"user_id" gorm:"column:user_id"`
}

type CollectionPayload struct {
	FolderID       string `json:"folder_id" gorm:"column:folder_id"`
	CollectionType string `json:"information_type" gorm:"column:information_type"`
	CollectionData string `json:"information_payload" gorm:"column:information_payload"`
}

type Collection struct {
	ID             string `json:"id" gorm:"column:id"`
	FolderID       string `json:"folder_id" gorm:"column:folder_id"`
	CollectionType string `json:"information_type" gorm:"column:information_type"`
	CollectionData string `json:"information_payload" gorm:"column:information_payload"`
}

type ICollectionFolderRepository interface {
	CreateFolder(ctx context.Context, folder CollectionFolder) (err error)
	GetCollectionFolderByUser(ctx context.Context, userID string) (folders []CollectionFolder, err error)
	SaveCollectionToFolder(ctx context.Context, collection CollectionPayload) (err error)
	DeleteCollectionFolder(ctx context.Context, folderID string) (err error)
	GetAllCollectionFromFolder(ctx context.Context, folderID string) (collections []Collection, err error)
	DeleteCollection(ctx context.Context, collectionID string) (err error)
}

type ICollectionFolderUseCase interface {
	CreateFolder(ctx context.Context, folder CollectionFolder) (err error)
	GetCollectionFolderByUser(ctx context.Context) (folders []CollectionFolder, err error)
	SaveCollectionToFolder(ctx context.Context, collection CollectionPayload) (err error)
	DeleteCollectionFolder(ctx context.Context, folderID string) (err error)
	GetAllCollectionFromFolder(ctx context.Context, folderID string) (collections []Collection, err error)
	DeleteCollection(ctx context.Context, collectionID string) (err error)
}
