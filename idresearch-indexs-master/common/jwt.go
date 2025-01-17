package common

import (
	"fmt"
	"idresearch-web/domains"
	"log"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/spf13/viper"
)

var JWT_SECRET = []byte(viper.GetString("jwt_key"))

func ValidateToken(tokenString string) (bool, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return JWT_SECRET, nil
	})
	if err != nil {
		return false, err
	}
	log.Println(token.Valid)
	return true, nil
}

func Validate(tokenString string) (bool, jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return JWT_SECRET, nil
	})
	if err != nil {
		return false, nil, err
	}
	log.Println(token.Valid)

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return true, claims, err
	}

	return false, nil, err
}

func CreateToken(user domains.User) (string, error) {

	expiryTimeToken := time.Now().Add(time.Hour * 720).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":        user.ID,
		"exp":            expiryTimeToken,
		"full_name":      user.FullName,
		"email":          user.Email,
		"avatar":         user.Avatar,
		"role":           user.Role,
		"premium_member": user.PremiumMember,
	})

	tokenString, err := token.SignedString(JWT_SECRET)

	return tokenString, err
}
