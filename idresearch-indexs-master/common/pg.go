package common

import (
	"fmt"

	"github.com/spf13/viper"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func NewPGCon(host, user, password, dbname, port string) *gorm.DB {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Jakarta", host, user, password, dbname, port)
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Error),
	})
	sqldb, _ := db.DB()
	sqldb.SetMaxOpenConns(1)
	if err != nil {
		panic(err)
	}
	return db
}

func CreateDbCon() *gorm.DB {
	InitApplicationConfig("../")
	dbCon := NewPGCon(
		viper.GetString("database.main.hostname"),
		viper.GetString("database.main.username"),
		viper.GetString("database.main.password"),
		viper.GetString("database.main.db_name"),
		viper.GetString("database.main.port"),
	)
	return dbCon
}
