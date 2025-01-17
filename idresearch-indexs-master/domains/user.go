package domains

import (
	"context"
	"time"
)

type User struct {
	ID            string    `gorm:"column:uid"`
	FullName      string    `gorm:"column:full_name"`
	Email         string    `gorm:"column:email"`
	LastToken     string    `gorm:"column:last_token"`
	LogedAt       time.Time `gorm:"columns:loged_at"`
	IP            string    `gorm:"column:ip"`
	Avatar        string    `gorm:"column:avatar"`
	Role          string    `gorm:"column:role"`
	Status        string    `gorm:"column:status"`
	Institution   string    `gorm:"column:institution"`
	Bio           string    `gorm:"column:bio"`
	PremiumMember bool      `gorm:"column:premium_member"`
}

type GoogleUserInfo struct {
	FullName string
	Email    string
	Avatar   string
}

type IUserUseCase interface {
	LoginOauthGoogle(ctx context.Context, email, authToken string, ipv4 string) (jwt string, err error)
	GetAllUser(ctx context.Context) (users []User, err error)
	ChangeRoleUser(ctx context.Context, role, userID string) (err error)
	RefreshToken(ctx context.Context, authToken string) (jwt string, err error)
	IsUserPremium(ctx context.Context, email string) (bool, error)
	SetUserPremium(ctx context.Context, email string, status bool) error
}

type IUserRepository interface {
	GetUserByEmail(ctx context.Context, email string) (user User, err error)
	CreateUser(ctx context.Context, user User) (err error)
	UpdateUserByEmail(ctx context.Context, user User) (err error)
	GetUserAccountInformation(ctx context.Context, authToken string) (metadata GoogleUserInfo, err error)
	GetAllUser(ctx context.Context) (users []User, err error)
	ChangeRoleUser(ctx context.Context, role, userID string) (err error)
	UpdatePremiumUser(ctx context.Context, email string, active bool) (err error)
}
