using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
public class GetAllMarcomBannerManagementResult
{
	public MarcomBannerResult Data { get; set; } = new MarcomBannerResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class MarcomBannerResult
{
	public List<MarcomBannerTable> Data { get; set; } = new List<MarcomBannerTable>();
	public CmsMarcomPagination Pagination { get; set; } = new CmsMarcomPagination();
	public string? Time { get; set; } = string.Empty;
}

public class CmsMarcomPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}
public class MarcomBannerTable
{
	public Guid Id { get; set; }
	public string? BannerName { get; set; }
	public bool IsHasContent { get; set; }
	public bool IsHasLink { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public MarcomBannerOrder? ConfigOrder { get; set; }
	public MarcomBannerManagementDetail Content { get; set; } = new MarcomBannerManagementDetail();
}

public class MarcomBannerOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
