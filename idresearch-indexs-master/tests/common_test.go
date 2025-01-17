package tests

import (
	"context"
	"errors"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"idresearch-web/repositories"
	"testing"
	"time"

	"github.com/go-redis/redis/v9"
	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/valyala/fasthttp"
)

func LockAja(name string, ttl time.Duration) error {
	// Connect to redis.
	client := redis.NewClient(&redis.Options{
		Network: "tcp",
		Addr:    "127.0.0.1:6379",
	})
	defer client.Close()

	_, err := client.Get(context.Background(), name).Result()
	if err != nil {
		if err.Error() == "redis: nil" {
			return client.Set(context.Background(), name, name, ttl).Err()
		} else {
			return err
		}
	}
	return errors.New("resource locked")
}

func TestLockError(t *testing.T) {
	client := redis.NewClient(&redis.Options{
		Network: "tcp",
		Addr:    "127.0.0.1:2222",
	})
	dlm := common.NewDLM(client)
	err := dlm.Lock("hello", 1*time.Minute)
	assert.Error(t, err)
}

func UnlockAja(name string) error {
	// Connect to redis.
	client := redis.NewClient(&redis.Options{
		Network: "tcp",
		Addr:    "127.0.0.1:6379",
	})
	defer client.Close()

	err := client.Del(context.Background(), name).Err()
	return err
}

func TestDLMLock(t *testing.T) {
	err := LockAja("madura", 5*time.Second)
	if err != nil {
		assert.Equal(t, "resource locked", err.Error())

	} else {
		assert.Nil(t, err)
	}
}

func TestDLMUnLock(t *testing.T) {
	err := UnlockAja("madura")
	assert.Nil(t, err)
}

func TestMIddlewareJWT(t *testing.T) {

	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	app := fiber.New()

	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})

	userTokenClaims := &domains.User{
		ID: users[0].ID,
	}
	err = common.AuthJWT(ctx)
	common.Cors(app)

	ctx.SetUserContext(context.WithValue(ctx.UserContext(), common.USER_CLAIMS_TOKEN, userTokenClaims))

	assert.Nil(t, err)
}

func TestValidMIddlewareJWT(t *testing.T) {

	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered. Error: ctx next fiber \n", r)
		}
	}()

	userRepo := repositories.NewUserRepository(common.CreateDbCon())
	users, err := userRepo.GetAllUser(context.Background())

	app := fiber.New()

	ctx := app.AcquireCtx(&fasthttp.RequestCtx{})

	userTokenClaims := &domains.User{
		ID: users[0].ID,
	}
	ctx.Request().Header.Add("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXIiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UwTnhNLXV2dEJpQTlIaGtkVXFNajJiMUJHT1locEYxZDhLR3loODBDdz1zOTYtYyIsImVtYWlsIjoiYWxmaWFua2FuMTlAZ21haWwuY29tIiwiZXhwIjoxNjY2MTYxOTg1LCJmdWxsX25hbWUiOiJBbGZpYW5rYW4gTnVyIGZhdGhvbmkiLCJ1c2VyX2lkIjoiN2NhMGNiOWEtNGE4Ni00MTA2LWI4MmEtMjM5NjU2ZTBmNTg4In0.Qq0kAdrt3jwvDr9bdZtfDcMCOScyYp0ZGYtFXdK0RoU")
	err = common.AuthJWT(ctx)
	common.Cors(app)

	ctx.SetUserContext(context.WithValue(ctx.UserContext(), common.USER_CLAIMS_TOKEN, userTokenClaims))

	assert.Nil(t, err)
}

func TestValidateJWT(t *testing.T) {

	_, _, err := common.Validate("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdmF0YXIiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BTG01d3UwTnhNLXV2dEJpQTlIaGtkVXFNajJiMUJHT1locEYxZDhLR3loODBDdz1zOTYtYyIsImVtYWlsIjoiYWxmaWFua2FuMTlAZ21haWwuY29tIiwiZXhwIjoxNjY2MTYxOTg1LCJmdWxsX25hbWUiOiJBbGZpYW5rYW4gTnVyIGZhdGhvbmkiLCJ1c2VyX2lkIjoiN2NhMGNiOWEtNGE4Ni00MTA2LWI4MmEtMjM5NjU2ZTBmNTg4In0.Qq0kAdrt3jwvDr9bdZtfDcMCOScyYp0ZGYtFXdK0RoU")
	assert.Nil(t, err)
}

func TestInvalidPgConn(t *testing.T) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("Recovered. Error:\n", r)
		}
	}()
	common.NewPGCon("localhost", "bad", "bad", "bad", "5432")
}
