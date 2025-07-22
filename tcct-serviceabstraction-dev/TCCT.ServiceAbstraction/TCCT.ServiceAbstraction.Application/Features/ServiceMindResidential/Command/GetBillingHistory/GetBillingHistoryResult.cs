namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Command.GetBillingHistory;
public class GetBillingHistoryResult
{
	public object? data { get; set; }
	public List<string>? periodLabels { get; set; }
	public List<string>? comparisonLabels { get; set; }
}