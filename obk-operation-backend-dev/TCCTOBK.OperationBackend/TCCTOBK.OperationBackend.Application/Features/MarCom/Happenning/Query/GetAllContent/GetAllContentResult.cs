using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Happening.Query.GetAllContent;
public class GetAllContentResult
{
	public ContentResult Data { get; set; } = new ContentResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class ContentResult
{
	public List<ContentTable> Data { get; set; } = new List<ContentTable>();
	public DigitalPagination Pagination { get; set; } = new DigitalPagination();
	public string? CategoryName { get; set; }
}

public class ContentPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}


public class ContentTable
{
	public Guid Id { get; set; }
	public string? Title { get; set; }
	public string? Category { get; set; }
	public bool IsPin { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public ContentOrder? ConfigOrder { get; set; }
	public ContentManagementDetail Content { get; set; } = new ContentManagementDetail();
}

public class ContentOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
