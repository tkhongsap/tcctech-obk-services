using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllCategory;
public class GetAllCategoryResult
{
	public CategoryResult Data { get; set; } = new CategoryResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class CategoryResult
{
	public List<CategoryTable> Data { get; set; } = new List<CategoryTable>();
	public CategoryPagination Pagination { get; set; } = new CategoryPagination();
	public string? Time { get; set; } = string.Empty;
}

public class CategoryPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}
public class CategoryTable
{
	public Guid Id { get; set; }
	public string? CategoryName { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public CategoryOrder? ConfigOrder { get; set; }
}

public class CategoryOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
