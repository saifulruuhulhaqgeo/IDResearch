package tests

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"idresearch-web/usecases"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestLoginOauthGoogle(t *testing.T) {
	common.InitApplicationConfig("../")

	t.Run("login using google oauth using mock", func(t *testing.T) {

		mockUser := domains.User{
			FullName: "Alfian Nur Fathoni",
			Email:    "alfiankan19@gmail.com",
			Role:     "USR",
			Avatar:   "https://ava.com/123",
		}
		mockGoogleInfo := domains.GoogleUserInfo{
			FullName: "Alfian Nur Fathoni",
			Email:    "alfiankan19@gmail.com",
			Avatar:   "https://ava.com/123",
		}

		repo := repositories.UserRepositoryMock{Mock: &mock.Mock{}}
		repo.Mock.On("GetUserByEmail", "alfiankan19@gmail.com").Return(mockUser, nil)
		repo.Mock.On("GetUserAccountInformation", "mytoken").Return(mockGoogleInfo, nil)
		repo.Mock.On("CreateUser", mockUser).Return(nil)

		uc := usecases.NewUserUseCase(&repo)
		_, err := uc.LoginOauthGoogle(context.Background(), "alfiankan19@gmail.com", "mytoken", "129.31.213.2")
		assert.Nil(t, err)

	})
}
