package models

type OauthGoogleReq struct {
	Token string `json:"token"`
	Email string `json:"email"`
}

type CreateFolderCollectionReq struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	IsPublic    bool   `json:"is_public"`
}

type SetRoleReq struct {
	Role string `json:"role"`
}
