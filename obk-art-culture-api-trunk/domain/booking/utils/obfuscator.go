package utils

import (
	"github.com/sqids/sqids-go"
)

// NOTE: Use this const as environment variable if you want to dynamically change the obfuscation alphabet.
const obfuscationAlphabet = "987654321ABCDEFGHIJKLMNOPQRSTUVWXYZ"

func NewSqids() *sqids.Sqids {
	s, _ := sqids.New(sqids.Options{
		Alphabet:  obfuscationAlphabet,
		MinLength: 6,
	})
	return s
}

func EncodeIDToObfuscatedString(id int) string {
	s := NewSqids()
	str, _ := s.Encode([]uint64{uint64(id)})
	return str
}

func DecodeObfuscatedStringToID(obfuscatedBase64 string) int {
	s := NewSqids()
	numbers := s.Decode(obfuscatedBase64)
	originalId := int(numbers[0])
	return originalId
}
