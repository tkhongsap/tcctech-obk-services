using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;
public class CreateUserCommand : ICommand<CreateUserResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string EmailOrPhone { get; set; }
	public string Password { get; set; } = null!;
	public string Firstname { get; set; } = null!;
	public string Lastname { get; set; } = null!;

	public CreateUserCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret,
		string emailOrPhone, string password, string firstname, string lastname)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		EmailOrPhone = emailOrPhone.Trim().ToLower();
		Password = password;
		Firstname = firstname;
		Lastname = lastname;
	}

}
