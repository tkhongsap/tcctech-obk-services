using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Roster.Query.GetRoster;
public class GetRosterQuery : IQuery<trRoster>
{
	public Guid Roid { get; set; }
	public GetRosterQuery(Guid roid)
	{
		Roid = roid;
	}
}