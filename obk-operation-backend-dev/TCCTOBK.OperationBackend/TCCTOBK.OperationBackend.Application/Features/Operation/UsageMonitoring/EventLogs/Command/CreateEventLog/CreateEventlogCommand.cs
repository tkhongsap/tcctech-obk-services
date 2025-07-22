using MediatR;
namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.EventLogs.Command.CreateEventLog;

public class CreateEventlogCommand : IRequest<CreateEventLogResult>
{
	public string? Type { get; set; } = "LOGIN";
	public DateTime? Time { get; set; } = DateTime.UtcNow;
	public string? ipAddress { get; set; } = "";
	public string? AuthMethod { get; set; } = "openid-connect";
	public Guid? TokenId { get; set; } = Guid.Empty;
	public string? GrantType { get; set; } = "password";
	public string? RefreshTokenType { get; set; } = "Refresh";
	public string? Scope { get; set; } = "profile email";
	public Guid? RefreshTokenId { get; set; } = Guid.Empty;
	public string? ClientAuthMethod { get; set; } = "client-secret";
	public Guid? UserName { get; set; }
	public Guid? CSID { get; set; }
}