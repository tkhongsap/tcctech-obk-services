namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;
public class LoginRequest
{
	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;

	public LoginRequest(string username, string password)
	{
		Username = username;
		Password = password;
	}
}
