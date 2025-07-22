using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;
public class UpdatePasswordCommand : ICommand<UpdatePasswordResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string UsernameOrAttribute { get; set; } = null!;
	public string OldPassword { get; set; } = null!;
	public string NewPassword { get; set; } = null!;

	public UpdatePasswordCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, string usernameOrAttribute, string oldPassword, string newPassword)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		UsernameOrAttribute = usernameOrAttribute.Trim().ToLower();
		OldPassword = oldPassword;
		NewPassword = newPassword;
	}
}
