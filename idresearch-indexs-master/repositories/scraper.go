package repositories

import (
	"context"
	"fmt"
	"idresearch-web/common"
	"idresearch-web/domains"
	"math/rand"
	"sync"
	"time"

	"gorm.io/gorm"
)

type ScraperRepository struct {
	db                 *gorm.DB
	daerahLevelPointer int
	s                  sync.RWMutex
}

func NewScraperRepository(db *gorm.DB) domains.IScraperRepository {
	return &ScraperRepository{
		db:                 db,
		daerahLevelPointer: 1,
	}
}

func (r *ScraperRepository) GetDaerahAndTopic(ctx context.Context) (topic domains.ScraperTopic, daerah domains.ScraperDaerah, daerahLevel int, err error) {
	r.s.Lock()

	rand.Seed(time.Now().UnixMilli())
	daerahLevel = r.daerahLevelPointer
	if r.daerahLevelPointer == 4 {
		r.daerahLevelPointer = 1
	} else {
		if r.daerahLevelPointer < 4 {
			r.daerahLevelPointer = r.daerahLevelPointer + 1
		}
	}

	r.s.Unlock()

	tx := r.db.WithContext(ctx).Begin()

	if err = tx.Raw("SELECT * FROM (SELECT id,name,total_informations FROM topic ORDER BY random() LIMIT 10) x ORDER BY x.total_informations ASC").First(&topic).Error; err != nil {
		tx.Rollback()
		return
	}
	if err = tx.Raw(fmt.Sprintf("SELECT * FROM (SELECT DISTINCT ON (%s_code) %s_code, label AS name, %s_code AS code, total_informations, active, visited FROM %s) x WHERE active = true ORDER BY visited ASC", common.DaerahLevel[daerahLevel], common.DaerahLevel[daerahLevel], common.DaerahLevel[daerahLevel], common.DaerahLevel[daerahLevel])).First(&daerah).Error; err != nil {
		tx.Rollback()
		return
	}

	if err = tx.Exec(fmt.Sprintf("UPDATE %s SET visited=visited+1 WHERE %s_code = ?", common.DaerahLevel[daerahLevel], common.DaerahLevel[daerahLevel]), daerah.DaerahCode).Error; err != nil {
		tx.Rollback()
		return
	}

	tx.Commit()

	return
}
