package repositories

import (
	"context"
	"idresearch-web/domains"

	"gorm.io/gorm"
)

type CollectionFolderRepository struct {
	db *gorm.DB
}

func NewCollectionFolderRepository(db *gorm.DB) domains.ICollectionFolderRepository {
	return &CollectionFolderRepository{
		db,
	}
}

func (r *CollectionFolderRepository) CreateFolder(ctx context.Context, folder domains.CollectionFolder) (err error) {
	err = r.db.WithContext(ctx).Table("user_collection_folder").Create(&folder).Error
	return
}

func (r *CollectionFolderRepository) GetCollectionFolderByUser(ctx context.Context, userID string) (folders []domains.CollectionFolder, err error) {
	err = r.db.WithContext(ctx).Table("user_collection_folder").Where("user_id", userID).Order("created_at DESC").Find(&folders).Error
	return
}

func (r *CollectionFolderRepository) SaveCollectionToFolder(ctx context.Context, collection domains.CollectionPayload) (err error) {
	err = r.db.WithContext(ctx).Table("user_collections").Create(&collection).Error
	return
}

func (r *CollectionFolderRepository) DeleteCollectionFolder(ctx context.Context, folderID string) (err error) {
	err = r.db.WithContext(ctx).Table("user_collection_folder").Where("id", folderID).Delete(&domains.CollectionFolder{}).Error
	return
}

func (r *CollectionFolderRepository) GetAllCollectionFromFolder(ctx context.Context, folderID string) (collections []domains.Collection, err error) {
	err = r.db.WithContext(ctx).Table("user_collections").Where("folder_id", folderID).Find(&collections).Error
	return
}

func (r *CollectionFolderRepository) DeleteCollection(ctx context.Context, collectionID string) (err error) {
	err = r.db.WithContext(ctx).Table("user_collections").Where("id", collectionID).Delete(&domains.Collection{}).Error
	return
}
