using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;
public class EventsLogModel : IQuery<EventsLogResponse>
{
	public int? Id { get; set; }
	public string? Type { get; set; }
	public long Time { get; set; }
	public string? IpAddress { get; set; }
	public string? AuthMethod { get; set; }
	public Guid TokenId { get; set; }
	public string? GrantType { get; set; }
	public string? RefreshTokenType { get; set; }
	public string? Scope { get; set; }
	public Guid RefreshTokenId { get; set; }
	public string? ClientAuthMethod { get; set; }
	public Guid username { get; set; }
}