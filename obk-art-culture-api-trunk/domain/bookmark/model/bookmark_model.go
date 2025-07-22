package model

type BookmarkCreateModel struct {
	ContentType string 	`json:"contentType" validate:"required"`
	ContentId 	string 	`json:"contentId" validate:"required"`
}

type BookmarkDeleteModel struct {
	ContentType string 	`json:"contentType" validate:"required"`
	ContentId 	string 	`json:"contentId" validate:"required"`
}