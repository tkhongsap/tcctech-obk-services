package repository

import (
	"context"

	"example.com/art-culture-api/domain/act_c/entity"
)

type ArtCTranslationRepository interface {
	FindByArtCTypeIdAndArtCCategoryIdAndLocale(ctx context.Context, artCTypeID *uint, artCCategoryID *uint, locale string) (entity.ArtCTranslation, error)
	FindByArtCTypeIdAndArtCCategoryIdAndLocaleWithDefault(ctx context.Context, artCTypeID *uint, artCCategoryID *uint, locale string) (entity.ArtCTranslation, error)
    FindByTuplesOfArtCTypeIdAndArtCCategoryIdAndLocale(ctx context.Context, tuples [][]interface{}) ([]entity.ArtCTranslation, error)
}
