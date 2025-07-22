using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.Summary;
public class SummaryQuery : IQuery<UsageLogMonitoring>
{
	public DateTime Date { get; set; } = DateTime.UtcNow;

	// public DateTime Date { get; set; } = DateTime.UtcNow.Date;
}
