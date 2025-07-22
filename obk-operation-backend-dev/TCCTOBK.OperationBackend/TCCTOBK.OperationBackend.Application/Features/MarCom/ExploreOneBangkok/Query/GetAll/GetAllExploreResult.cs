using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Command.DigitalLibrary;
using TCCTOBK.OperationBackend.Application.Features.Sustainability.DigitalLibraryManagement.Query.GetAllDigitalLibrary;

namespace TCCTOBK.OperationBackend.Application.Features.Marcom.Explore.Query.GetAllExplore;
public class GetAllExploreResult
{
	public ExploreResult Data { get; set; } = new ExploreResult();
	public int StatusCode { get; set; }
	public string? Message { get; set; }
}

public class ExploreResult
{
	public List<ExploreTable> Data { get; set; } = new List<ExploreTable>();
	public ExplorePagination Pagination { get; set; } = new ExplorePagination();
	public string? Time { get; set; } = string.Empty;
}

public class ExplorePagination
{
	public int Total { get; set; }
	public int Page_number { get; set; }
	public int Total_page { get; set; }
}
public class ExploreTable
{
	public Guid Id { get; set; }
	public string? Title { get; set; }
	public bool IsHasEN { get; set; }
	public bool IsHasCN { get; set; }
	public bool IsHasTH { get; set; }
	public double? LastUpdate { get; set; }
	public string? Status { get; set; }
	public ExploreOrder? ConfigOrder { get; set; }
	public MarcomBannerManagementDetail Content { get; set; } = new MarcomBannerManagementDetail();
}

public class ExploreOrder
{
	public int? Current { get; set; }
	public int? Max { get; set; }
}
