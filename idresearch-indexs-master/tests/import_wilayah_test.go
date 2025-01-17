package tests

import (
	"fmt"
	"log"
	"testing"

	"gorm.io/driver/mysql"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func mysqlCon() *gorm.DB {
	dsn := "user1:password1@tcp(127.0.0.1:3306)/batas_wilayah_2020?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic(err)
	}
	return db
}

func pgCon() *gorm.DB {
	dsn := "host=database-idreasearch-dev.cyowgpudjgfu.ap-southeast-1.rds.amazonaws.com user=postgres password=R1T3TYYN dbname=idresearch port=5432 sslmode=disable TimeZone=Asia/Jakarta"
	//dsn := "host=127.0.0.1 user=postgres password=473550 dbname=idreasearch port=5432 sslmode=disable TimeZone=Asia/Jakarta"

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	if err != nil {
		panic(err)
	}
	return db
}

type ProvinsiOld struct {
	ID          int64  `gorm:"column:id"`
	SHAPE       string `gorm:"column:area"`
	ProvinsiID  int64  `gorm:"column:kpu_idprov"`
	KabupatenID int64  `gorm:"column:kpu_idkab"`
	Name        string `gorm:"column:kabkot"`
}

func TestImportWilayah(t *testing.T) {
	db1 := mysqlCon()
	db2 := pgCon()

	var res []ProvinsiOld
	err := db1.Table("datatable_kabupaten").Select("OGR_FID AS id, ST_AsGeoJSON(SHAPE) AS area, kpu_idprov, kpu_idkab, kpu_kab AS kabkot").Scan(&res).Error
	if err != nil {
		panic(err)
	}
	for i, v := range res {
		fmt.Println(i, v.Name, v.ProvinsiID, v.KabupatenID, v.KabupatenID)

		err := db2.Table("kabupaten").Exec("INSERT INTO public.kabupaten (label, description, geoarea, active, total_informations, lock, provinsi_code, kabupaten_code) VALUES (?, ?, ST_GeomFromGeoJSON(?), true, 0, false, ?, ?)", v.Name, v.Name, v.SHAPE, v.ProvinsiID, v.KabupatenID).Error
		if err != nil {
			log.Println(err)
		}

	}
}
