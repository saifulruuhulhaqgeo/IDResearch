package usecases

import (
	"context"
	"idresearch-web/common"
	"idresearch-web/domains"
	"log"
	"time"
)

type UserUseCase struct {
	UserRepository domains.IUserRepository
}

func NewUserUseCase(userRepository domains.IUserRepository) domains.IUserUseCase {
	return &UserUseCase{
		UserRepository: userRepository,
	}
}

func (u *UserUseCase) CreateNewUser(ctx context.Context, userMetaData domains.GoogleUserInfo, authToken, email string) (user domains.User, err error) {
	err = u.UserRepository.CreateUser(ctx, domains.User{
		FullName:  userMetaData.FullName,
		Email:     userMetaData.Email,
		Avatar:    userMetaData.Avatar,
		Role:      "USR",
		LastToken: authToken,
		LogedAt:   time.Now(),
	})
	user, err = u.UserRepository.GetUserByEmail(ctx, email)
	return
}

func (u *UserUseCase) LoginOauthGoogle(ctx context.Context, email, authToken string, ipv4 string) (jwt string, err error) {

	userMetaData, err := u.UserRepository.GetUserAccountInformation(ctx, authToken)
	if err != nil {
		return
	}
	user, err := u.UserRepository.GetUserByEmail(ctx, email)
	if err != nil && err.Error() != "record not found" {
		return
	}
	if err != nil && err.Error() == "record not found" {
		user, err = u.CreateNewUser(ctx, userMetaData, authToken, email)
		if err != nil {
			return
		}
	}

	err = u.UserRepository.UpdateUserByEmail(ctx, domains.User{
		FullName:  userMetaData.FullName,
		Email:     userMetaData.Email,
		Avatar:    userMetaData.Avatar,
		LastToken: authToken,
		LogedAt:   time.Now(),
		IP:        ipv4,
	})

	jwt, err = common.CreateToken(user)

	return
}

func (u *UserUseCase) RefreshToken(ctx context.Context, authToken string) (jwt string, err error) {
	log.Println(authToken)
	valid, claims, err := common.Validate(authToken)

	if err != nil {
		return
	}
	if !valid {
		return
	}

	userMetaData, err := u.UserRepository.GetUserAccountInformation(ctx, authToken)
	if err != nil {
		return
	}

	user, err := u.UserRepository.GetUserByEmail(ctx, claims["email"].(string))
	if err != nil && err.Error() != "record not found" {
		return
	}
	if err != nil && err.Error() == "record not found" {
		user, err = u.CreateNewUser(ctx, userMetaData, authToken, claims["email"].(string))
		if err != nil {
			return
		}
	}

	err = u.UserRepository.UpdateUserByEmail(ctx, domains.User{
		FullName:      userMetaData.FullName,
		Email:         userMetaData.Email,
		Avatar:        userMetaData.Avatar,
		LastToken:     authToken,
		LogedAt:       time.Now(),
		PremiumMember: user.PremiumMember,
	})

	jwt, err = common.CreateToken(user)

	return

}

func (r *UserUseCase) GetAllUser(ctx context.Context) (users []domains.User, err error) {
	users, err = r.UserRepository.GetAllUser(ctx)
	return
}
func (r *UserUseCase) ChangeRoleUser(ctx context.Context, role, userID string) (err error) {
	err = r.UserRepository.ChangeRoleUser(ctx, role, userID)
	return
}

func (r *UserUseCase) IsUserPremium(ctx context.Context, email string) (bool, error) {
	user, err := r.UserRepository.GetUserByEmail(ctx, email)
	if err != nil && err.Error() != "record not found" {
		return false, err
	}

	return user.PremiumMember, nil
}

func (r *UserUseCase) SetUserPremium(ctx context.Context, email string, status bool) error {
	log.Println("ACTIVE PREMIUM", status)
	err := r.UserRepository.UpdatePremiumUser(ctx, email, status)
	return err
}
