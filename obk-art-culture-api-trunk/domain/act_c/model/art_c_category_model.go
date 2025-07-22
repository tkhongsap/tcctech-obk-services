package model

type ArtCCategoryCreateOrUpdateModel struct {
	ArtCTypeID string `json:"artCTypeId" validate:"required"`
	ArtCCreateOrUpdateModel
}