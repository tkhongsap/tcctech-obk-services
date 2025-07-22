package contexts

// NOTE: Refactor these functions to by using decorator pattern if have more than 3 types
type ClientType struct {
	name string
}

func NewClientTypePublic() ClientType {
	return ClientType{
		name: "public",
	}
}

func NewClientTypeMobile() ClientType {
	return ClientType{
		name: "mobile",
	}
}

func NewClientTypeCMS() ClientType {
	return ClientType{
		name: "cms",
	}
}

func (a ClientType) IsPublic() bool {
	return a.name == "public"
}

func (a ClientType) IsMobile() bool {
	return a.name == "mobile"
}

func (a ClientType) IsCMS() bool {
	return a.name == "cms"
}

func (a ClientType) String() string {
	return string(a.name)
}