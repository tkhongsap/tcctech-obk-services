using System.Text.Json.Serialization;


namespace TCCTOBK.OperationBackend.Application.Features.Operation.UsageMonitoring.Query.EventsLog;

public class EventsLogResult
{
	[JsonPropertyName("time")]
	public long Time { get; set; }

	[JsonPropertyName("type")]
	public string? Type { get; set; }

	[JsonPropertyName("realmId")]
	public Guid RealmId { get; set; }

	[JsonPropertyName("clientId")]
	public string? ClientId { get; set; }

	[JsonPropertyName("userId")]
	public Guid UserId { get; set; }

	[JsonPropertyName("sessionId")]
	public Guid SessionId { get; set; }

	[JsonPropertyName("ipAddress")]
	public string? IpAddress { get; set; }

	[JsonPropertyName("details")]
	public Details Details { get; set; } = new Details();
}

public class Details
{
	[JsonPropertyName("auth_method")]
	public string? AuthMethod { get; set; }

	[JsonPropertyName("token_id")]
	public Guid TokenId { get; set; }

	[JsonPropertyName("grant_type")]
	public string? GrantType { get; set; }

	[JsonPropertyName("refresh_token_type")]
	public string? RefreshTokenType { get; set; }

	[JsonPropertyName("scope")]
	public string? Scope { get; set; }

	[JsonPropertyName("refresh_token_id")]
	public Guid RefreshTokenId { get; set; }

	[JsonPropertyName("client_auth_method")]
	public string? ClientAuthMethod { get; set; }

	[JsonPropertyName("username")]
	public Guid Username { get; set; }
}