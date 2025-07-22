package model

import "time"

type ProgramCreateOrUpdateModel struct {
	IsPublished 	bool 						`json:"isPublished" validate:"required"`
	PublishedAt 	time.Time					`json:"publishedAt"`
	Title       	string 						`json:"title" validate:"required"`
	Desc		 	string 						`json:"desc" validate:"required"`
	Author			string						`json:"author"`
	Thumbnail   	string 						`json:"thumbnail" validate:"required"`
	Durations    	uint						`json:"durations"`
	Link     		string 						`json:"link"`
}