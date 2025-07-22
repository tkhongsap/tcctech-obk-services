package utils

// If returns vtrue if cond is true, otherwise returns vfalse.
//	// Usage
//	utils.If(true, 1, 0)
//	*utils.If(request.ProgramID != nil, request.ProgramID, &bookingSetting.ProgramID)
//
// Consider using the [cmp.Or] function instead if upgraded to go1.22.0 or later.
//
//	// Example
//	fmt.Println(*cmp.Or(nil, &[]int{1}[0]))
//
// [cmp.Or]: https://pkg.go.dev/cmp#Or
func If[T any](cond bool, vtrue, vfalse T) T {
	if cond {
		return vtrue
	}
	return vfalse
}
