using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetBillingHistory;
public class GetBillingHistoryCommand : ICommand<GetBillingHistoryResult>
{
	public string TenantId { get; set; }
	public FilterGetLatestMeterReading? Filter { get; set; }
	public bool? CompareLastYear { get; set; }
}

public class FilterGetLatestMeterReading
{
	public List<int>? meterTypeIds { get; set; }
	public List<int>? PropertyUnitIds { get; set; }
}