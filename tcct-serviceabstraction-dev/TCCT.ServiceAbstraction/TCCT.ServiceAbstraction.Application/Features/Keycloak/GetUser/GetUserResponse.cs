namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
public class GetUserResponse
{
	public Guid id { get; set; }
	public long createdTimestamp { get; set; }
	public string username { get; set; } = null!;
	public bool enabled { get; set; }
	public bool totp { get; set; }
	public bool emailVerified { get; set; }
	public string firstName { get; set; } = null!;
	public string lastName { get; set; } = null!;
	public string email { get; set; } = null!;
	public long notBefore { get; set; }
	public Dictionary<string, List<string>> attributes { get; set; } = new();
}
