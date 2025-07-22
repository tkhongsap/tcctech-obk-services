using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.ContentManagement.Query.GetAllContentManagement;
public class GetAllContentManagementResult
{
	public CmsResult Data { get; set; } = new CmsResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class CmsResult
{
	public List<CmsTable> Data { get; set; } = new List<CmsTable>();
	public DigitalPagination Pagination { get; set; } = new DigitalPagination();
}

public class CmsPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}


public class CmsTable
{
	public Guid Id { get; set; }
	public string? Sustainability { get; set; }
	public bool IsHasSubMenu { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public CmsOrder? ConfigOrder { get; set; }
	public ContentManagementDetail Content { get; set; } = new ContentManagementDetail();
}

public class CmsOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
