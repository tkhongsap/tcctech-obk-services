package utils_test

import (
	"testing"

	"example.com/art-culture-api/domain/booking/utils"
	"github.com/stretchr/testify/assert"
)

func TestObfuscator(t *testing.T) {
	id := 123456
	obfuscated := utils.EncodeIDToObfuscatedString(id)
	originalId := utils.DecodeObfuscatedStringToID(obfuscated)

	assert.Equal(t, id, originalId)
}