package contexts_test

import (
	"testing"

	"example.com/art-culture-api/pkg/contexts"
	"github.com/stretchr/testify/assert"
)

func TestClientType(t *testing.T) {
	public := contexts.NewClientTypePublic()
	mobile := contexts.NewClientTypeMobile()
	cms := contexts.NewClientTypeCMS()

	assert.Equal(t, "public", public.String())
	assert.Equal(t, "mobile", mobile.String())
	assert.Equal(t, "cms", cms.String())

	assert.True(t, public.IsPublic())
	assert.False(t, public.IsMobile())
	assert.False(t, public.IsCMS())

	assert.True(t, mobile.IsMobile())
	assert.False(t, mobile.IsCMS())
	assert.False(t, mobile.IsPublic())

	assert.False(t, cms.IsPublic())
	assert.False(t, cms.IsMobile())
	assert.True(t, cms.IsCMS())
}