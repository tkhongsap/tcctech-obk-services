using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Helper.Table;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRosterList;
public class GetRosterListQuery : TableState, IQuery<GetRosterListResult>
{
	public string? Component { get; set; }
}