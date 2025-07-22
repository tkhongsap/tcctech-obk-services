package utils_test

import (
	"testing"

	"example.com/art-culture-api/domain/booking/utils"
)

func TestIf(t *testing.T) {
	tests := []struct {
		cond     bool
		vtrue    int
		vfalse   int
		expected int
	}{
		{true, 1, 0, 1},
		{false, 1, 0, 0},
	}

	for _, test := range tests {
		actual := utils.If(test.cond, test.vtrue, test.vfalse)
		if actual != test.expected {
			t.Errorf("If(%v, %v, %v); got %v, expected %v", test.cond, test.vtrue, test.vfalse, actual, test.expected)
		}
	}
}
