package configuration

import (
	"log"
	"math/rand"
	"os"
	"strconv"
	"time"
	_ "time/tzdata"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func SetupDatabase(config Config) *gorm.DB {
	username := config.Get("DATASOURCE_USERNAME")
	password := config.Get("DATASOURCE_PASSWORD")

	host := config.Get("DATASOURCE_HOST")
	port := config.Get("DATASOURCE_PORT")

	dbName := config.Get("DATASOURCE_DB_NAME")

	maxPoolOpen, _ := strconv.Atoi(config.Get("DATASOURCE_POOL_MAX_CONN"))
	maxPoolIdle, _ := strconv.Atoi(config.Get("DATASOURCE_POOL_IDLE_CONN"))
	maxPollLifeTime, err := strconv.Atoi(config.Get("DATASOURCE_POOL_LIFE_TIME"))
	if(err != nil) {
		log.Fatalf("could not parse pool config: %v", err)
	}

	loggerDb := logger.New(
		log.New(os.Stdout, "\r\n", log.LstdFlags),
		logger.Config{
			SlowThreshold:             time.Second,
			LogLevel:                  logger.Info,
			IgnoreRecordNotFoundError: true,
			Colorful:                  true,
		},
	)

	dbURL := "postgres://" + username + ":" + password + "@" + host + ":" + port + "/" + dbName
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{
		Logger: loggerDb,
		PrepareStmt: false,
		NowFunc: func() time.Time {
			loc, _ := time.LoadLocation("Asia/Bangkok")
			return time.Now().In(loc)
		},
	})
	if(err != nil) {
		log.Fatalf("could not connect to database: %v", err)
	}

	sqlDB, err := db.DB()
	if(err != nil) {
		log.Fatalf("could not get sql.DB: %v", err)
	}

	sqlDB.SetMaxOpenConns(maxPoolOpen)
	sqlDB.SetMaxIdleConns(maxPoolIdle)
	sqlDB.SetConnMaxLifetime(time.Duration(rand.Int31n(int32(maxPollLifeTime))) * time.Millisecond)

	// seeder.RunSeeder(db)

	return db
}
