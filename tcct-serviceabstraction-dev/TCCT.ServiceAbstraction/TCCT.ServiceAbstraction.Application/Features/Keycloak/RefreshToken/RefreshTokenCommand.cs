using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RefreshToken;

public class RefreshTokenCommand : ICommand<RefreshTokenResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string RefreshToken { get; set; } = null!;

	public RefreshTokenCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, string refreshToken)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		RefreshToken = refreshToken;
	}
}
