package common

import (
	"github.com/go-redis/redis/v9"
)

func NewRedisConn(host string) *redis.Client {
	client := redis.NewClient(&redis.Options{
		Network:  "tcp",
		Username: "default",
		Password: "4KSfxhDRxL4dEZE1w57ywncuDiZ7GnEL",
		Addr:     host,
	})

	return client
}
