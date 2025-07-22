package model

type PartnerCreateOrUpdateModel struct {
	Title    string `json:"title" validate:"required"`
	Thumbnail string `json:"thumbnail" validate:"required"`
	Link     string `json:"link"`
}