using TCCT.ServiceAbstraction.Application.Configuration.Commands;
namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetServiceRequestList;
public class GetServiceRequestListCommand : ICommand<GetServiceRequestListResult>
{
	public string TenantId { get; set; }
	public int? PerPage { get; set; }
	public int? CurrentPage { get; set; }

	public FilterRepaireList Filter { get; set; } = new FilterRepaireList();
}

public class FilterRepaireList
{ 
	public int? ProjectId { get; set; }
	public int? ServiceRequestTypeId { get; set; }
	public DateTime? FromDate { get; set; }
	public DateTime? ToDate { get; set; }
	public int? CmStatusId { get; set; }
	public int? UnitId { get; set; }
}