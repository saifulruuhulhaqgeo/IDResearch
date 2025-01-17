package repositories

import (
	"context"
	"idresearch-web/domains"

	"github.com/stretchr/testify/mock"
)

type UserRepositoryMock struct {
	Mock *mock.Mock
}

func (m *UserRepositoryMock) GetUserByEmail(ctx context.Context, email string) (user domains.User, err error) {
	args := m.Mock.Called(email)
	workspace := args.Get(0).(domains.User)
	return workspace, args.Error(1)
}
func (m *UserRepositoryMock) UpdateUserByEmail(ctx context.Context, user domains.User) (err error) {
	return
}
func (m *UserRepositoryMock) CreateUser(ctx context.Context, user domains.User) (err error) {
	args := m.Mock.Called(user)
	return args.Error(0)
}
func (m *UserRepositoryMock) GetUserAccountInformation(ctx context.Context, authToken string) (metadata domains.GoogleUserInfo, err error) {
	args := m.Mock.Called(authToken)
	workspace := args.Get(0).(domains.GoogleUserInfo)
	return workspace, args.Error(1)
}

func (m *UserRepositoryMock) GetAllUser(ctx context.Context) (users []domains.User, err error) {
	return
}
func (m *UserRepositoryMock) ChangeRoleUser(ctx context.Context, role, userID string) (err error) {
	return
}
