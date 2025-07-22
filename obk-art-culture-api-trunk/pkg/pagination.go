package pkg

type Pagination struct {
	Page         int    `json:"page,omitempty"`
	Limit        int    `json:"limit,omitempty"`
	Sort         string `json:"sort,omitempty"`
	TotalRecords int64  `json:"totalRecords"`
	TotalPages   int    `json:"totalPages"`
	NextPage     int    `json:"nextPage,omitempty"`
	PreviousPage int    `json:"previousPage,omitempty"`
	Data         any    `json:"data"`
}

func (p *Pagination) GetOffset() int {
	return (p.GetPage() - 1) * p.GetLimit()
}

func (p *Pagination) GetLimit() int {
	if p.Limit == 0 {
		p.Limit = 10
	}
	return p.Limit
}

func (p *Pagination) GetPage() int {
	if p.Page == 0 {
		p.Page = 1
	}
	return p.Page
}

func (p *Pagination) GetSort() string {
	if p.Sort == "" {
		p.Sort = "id desc"
	}
	return p.Sort
}
