package common

import (
	"context"
	"errors"
	"time"

	"github.com/go-redis/redis/v9"
)

type DLM struct {
	client *redis.Client
}

func NewDLM(redisClient *redis.Client) DLM {
	return DLM{
		redisClient,
	}
}

func (d *DLM) Lock(name string, ttl time.Duration) error {

	_, err := d.client.Get(context.Background(), name).Result()
	if err != nil {
		if err.Error() == "redis: nil" {
			return d.client.Set(context.Background(), name, name, ttl).Err()
		} else {
			return err
		}
	}
	return errors.New("resource locked")
}

func (d *DLM) Unlock(name string) error {

	err := d.client.Del(context.Background(), name).Err()
	return err
}
