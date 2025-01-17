package repositories

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"idresearch-web/domains"
	"io/ioutil"
	"time"

	"github.com/gojek/heimdall/v7/httpclient"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) domains.IUserRepository {
	return &UserRepository{
		db,
	}
}

func (r *UserRepository) GetUserByEmail(ctx context.Context, email string) (user domains.User, err error) {
	err = r.db.WithContext(ctx).Table("users").Where("email", email).First(&user).Error
	return
}
func (r *UserRepository) UpdateUserByEmail(ctx context.Context, user domains.User) (err error) {
	err = r.db.WithContext(ctx).Table("users").Where("email", user.Email).Updates(&user).Error
	return
}

func (r *UserRepository) UpdatePremiumUser(ctx context.Context, email string, active bool) (err error) {
	err = r.db.WithContext(ctx).Table("users").Where("email", email).Update("premium_member", active).Error
	return
}

func (r *UserRepository) CreateUser(ctx context.Context, user domains.User) (err error) {
	err = r.db.WithContext(ctx).Table("users").Create(&user).Error
	return
}
func (r *UserRepository) GetUserAccountInformation(ctx context.Context, authToken string) (metadata domains.GoogleUserInfo, err error) {
	var googleMetaData map[string]any
	timeout := 2 * time.Minute
	client := httpclient.NewClient(httpclient.WithHTTPTimeout(timeout))
	url := fmt.Sprintf("https://www.googleapis.com/oauth2/v2/userinfo?access_token=%s", authToken)
	res, err := client.Get(url, nil)

	body, err := ioutil.ReadAll(res.Body)
	err = json.Unmarshal(body, &googleMetaData)
	if err != nil || googleMetaData["name"] == nil {
		err = errors.New("BAD TOKEN")
		return
	}
	metadata = domains.GoogleUserInfo{
		FullName: googleMetaData["name"].(string),
		Email:    googleMetaData["email"].(string),
		Avatar:   googleMetaData["picture"].(string),
	}

	return
}

func (r *UserRepository) GetAllUser(ctx context.Context) (users []domains.User, err error) {
	err = r.db.WithContext(ctx).Table("users").Find(&users).Order("full_name ASC").Error
	return
}
func (r *UserRepository) ChangeRoleUser(ctx context.Context, role, userID string) (err error) {
	err = r.db.WithContext(ctx).Table("users").Where("uid", userID).Update("role", role).Error
	return
}
