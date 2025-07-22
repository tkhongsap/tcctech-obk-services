namespace TCCTOBK.OperationBackend.Application.Contracts.DataModel.EventsLogRepository;
public class CreateEventsLogModel
{
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
	public Guid Username { get; set; }
	// public CreateEventsLogModel(string? type, long time, string? ipAddress, string? authMethod, Guid tokenId, string? grantType, string? refreshTokenType, string? scope, Guid refreshTokenId, string? clientAuthMethod, Guid username)
	// {
	// 	Type = type;
	// 	Time = time;
	// 	IpAddress = ipAddress;
	// 	AuthMethod = authMethod;
	// 	TokenId = tokenId;
	// 	GrantType = grantType;
	// 	RefreshTokenType = refreshTokenType;
	// 	Scope = scope;
	// 	RefreshTokenId = refreshTokenId;
	// 	ClientAuthMethod = clientAuthMethod;
	// 	Username = username;
	// }
}