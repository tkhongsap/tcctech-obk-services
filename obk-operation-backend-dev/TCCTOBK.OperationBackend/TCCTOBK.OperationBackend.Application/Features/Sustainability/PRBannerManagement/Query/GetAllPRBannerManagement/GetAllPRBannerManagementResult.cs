using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Sustainability.PRBannerManagement.Query.GetAllPRBannerManagement;
public class GetAllPRBannerManagementResult
{
	public PRBannerResult Data { get; set; } = new PRBannerResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class PRBannerResult
{
	public List<PRBannerTable> Data { get; set; } = new List<PRBannerTable>();
	public DigitalPagination Pagination { get; set; } = new DigitalPagination();
	public string? Time { get; set; } = string.Empty;
}

public class CmsPagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}
public class PRBannerTable
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
	public PRBannerOrder? ConfigOrder { get; set; }
	public PRBannerManagementDetail Content { get; set; } = new PRBannerManagementDetail();
}

public class PRBannerOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
