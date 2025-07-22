namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
public class GetUserResult
{
	public Guid ID { get; set; }
	public string Username { get; set; } = null!;
	public List<string> AuthAttributes { get; set; } = new();
	public string Firstname { get; set; } = null!;
	public string Lastname { get; set; } = null!;
}
