package model

import "time"

type FaqCreateOrUpdateModel struct {
	Question 		string 		`json:"question" validate:"required"`
	Answer   		string 		`json:"answer" validate:"required"`
	IsPublished 	bool 		`json:"isPublished" validate:"required"`
	PublishedAt 	time.Time	`json:"publishedAt"`
}

type FaqOrderModel struct {
	Ids	[]uint	`json:"ids" validate:"required"`
}