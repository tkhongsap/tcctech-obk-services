package pkg_test

import (
	"testing"

	"example.com/art-culture-api/pkg"
	"github.com/stretchr/testify/assert"
)

func TestPagination(t *testing.T) {
	tests := []struct {
		Name       string
		Pagination pkg.Pagination
		Expected   int
	}{
		{
			"empty page",
			pkg.Pagination{},
			0,
		},
		{
			"page 1",
			pkg.Pagination{Page: 1},
			0,
		},
		{
			"page 2",
			pkg.Pagination{Page: 2},
			10,
		},
		{
			"page 3",
			pkg.Pagination{Page: 3},
			20,
		},
	}
	for _, tt := range tests {
		t.Run(tt.Name, func(t *testing.T) {
			assert.Equal(t, tt.Expected, tt.Pagination.GetOffset())
			assert.Equal(t, tt.Pagination.Page, tt.Pagination.GetPage())
			assert.Equal(t, 10, tt.Pagination.GetLimit())
			assert.Equal(t, "id desc", tt.Pagination.GetSort())
		})
	}
}
