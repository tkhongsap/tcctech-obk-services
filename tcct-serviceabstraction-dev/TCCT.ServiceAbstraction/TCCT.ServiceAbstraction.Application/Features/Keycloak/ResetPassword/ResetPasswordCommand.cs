using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
public class ResetPasswordCommand : ICommand<ResetPasswordResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string UsernameOrAttribute { get; set; } = null!;
	public string NewPassword { get; set; } = null!;

	public ResetPasswordCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, string usernameOrAttribute, string newPassword)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		UsernameOrAttribute = usernameOrAttribute.Trim().ToLower();
		NewPassword = newPassword;
	}
}
