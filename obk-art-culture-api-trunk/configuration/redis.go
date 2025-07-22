package configuration

import (
	"strconv"

	"github.com/go-redis/redis/v8"
)

func SetupRedis(config Config) *redis.Client {
	address := config.Get("REDIS_HOST") + ":" + config.Get("REDIS_PORT")
	maxPoolSize, _ := strconv.Atoi(config.Get("DATASOURCE_POOL_IDLE_CONN"))

	redis := redis.NewClient(&redis.Options{
		Addr: address,
		Password: config.Get("REDIS_PASSWORD"),
		DB: 0,
		PoolSize: maxPoolSize,
	})

	return redis
}
