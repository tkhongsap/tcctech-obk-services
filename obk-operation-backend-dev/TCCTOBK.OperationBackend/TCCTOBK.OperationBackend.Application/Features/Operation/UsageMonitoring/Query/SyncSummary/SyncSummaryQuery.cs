using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.SyncSummary;
public class SyncSummaryQuery : IQuery<UsageLogMonitoring>
{
	public DateTime Date { get; set; } = DateTime.UtcNow;
}
