package usecases

import (
	"context"
	"idresearch-web/domains"
)

type CollectionFolderDataUseCase struct {
	folderCollectionRepository domains.ICollectionFolderRepository
}

func NewCollectionFolderDataUseCase(folderCollectionRepository domains.ICollectionFolderRepository) domains.ICollectionFolderUseCase {
	return &CollectionFolderDataUseCase{
		folderCollectionRepository: folderCollectionRepository,
	}
}

func (u *CollectionFolderDataUseCase) CreateFolder(ctx context.Context, folder domains.CollectionFolder) (err error) {
	folder.UserID = ctx.Value("USER_CLAIMS_TOKEN").(*domains.User).ID
	err = u.folderCollectionRepository.CreateFolder(ctx, folder)
	return
}

func (u *CollectionFolderDataUseCase) GetCollectionFolderByUser(ctx context.Context) (folders []domains.CollectionFolder, err error) {
	userID := ctx.Value("USER_CLAIMS_TOKEN").(*domains.User).ID
	folders, err = u.folderCollectionRepository.GetCollectionFolderByUser(ctx, userID)
	return
}

func (r *CollectionFolderDataUseCase) SaveCollectionToFolder(ctx context.Context, collection domains.CollectionPayload) (err error) {
	err = r.folderCollectionRepository.SaveCollectionToFolder(ctx, collection)
	return
}

func (u *CollectionFolderDataUseCase) DeleteCollectionFolder(ctx context.Context, folderID string) (err error) {
	return u.folderCollectionRepository.DeleteCollectionFolder(ctx, folderID)
}

func (u *CollectionFolderDataUseCase) GetAllCollectionFromFolder(ctx context.Context, folderID string) (collections []domains.Collection, err error) {
	return u.folderCollectionRepository.GetAllCollectionFromFolder(ctx, folderID)
}

func (u *CollectionFolderDataUseCase) DeleteCollection(ctx context.Context, collectionID string) (err error) {
	return u.folderCollectionRepository.DeleteCollection(ctx, collectionID)
}
