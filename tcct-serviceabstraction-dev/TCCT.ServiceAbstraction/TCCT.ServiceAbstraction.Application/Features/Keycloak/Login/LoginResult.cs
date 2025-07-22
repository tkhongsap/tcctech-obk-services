namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;
public class LoginResult
{
	public string access_token { get; set; } = null!;
	public string refresh_token { get; set; } = null!;
	public int expires_in { get; set; }
}
