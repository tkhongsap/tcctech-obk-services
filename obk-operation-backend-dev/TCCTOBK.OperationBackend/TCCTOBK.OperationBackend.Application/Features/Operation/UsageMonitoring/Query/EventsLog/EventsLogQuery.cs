using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
public class EventsLogQuery : IQuery<List<EventsLogResult>>
{
	public int? Max { get; set; } = 10;
	public string? Type { get; set; }
	public DateOnly? DateFrom { get; set; }
	public DateOnly? DateTo { get; set; }
	public string? ClientId { get; set; }
	public int? First { get; set; }
	public string? IpAddress { get; set; }
	public Guid? User { get; set; }



	public EventsLogQuery(int? max, string? type)
	{
		Max = max;
		Type = type?.Trim().ToUpper();
	}
}