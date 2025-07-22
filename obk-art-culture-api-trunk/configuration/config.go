package configuration

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config interface {
	Get(key string) string
}

type appConfig struct {}

func (config *appConfig) Get(key string) string {
	return os.Getenv(key)
}

func New() Config {
	err := godotenv.Load()
	if err != nil {
        log.Fatalf("could not load config: %v", err)
	}

	return &appConfig{}
}