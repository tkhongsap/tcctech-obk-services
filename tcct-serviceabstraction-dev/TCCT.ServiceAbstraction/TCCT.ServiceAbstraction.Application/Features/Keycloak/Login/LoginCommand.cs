using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;
public class LoginCommand : ICommand<LoginResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string Username { get; set; } = null!;
	public string Password { get; set; } = null!;

	public LoginCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, string username, string password)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		Username = username.Trim().ToLower();
		Password = password;
	}
}
