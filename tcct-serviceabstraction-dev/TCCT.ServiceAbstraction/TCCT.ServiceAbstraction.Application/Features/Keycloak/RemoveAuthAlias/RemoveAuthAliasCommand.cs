using TCCT.ServiceAbstraction.Application.Configuration.Commands;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;
public class RemoveAuthAliasCommand : ICommand<RemoveAuthAliasResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string UsernameOrAttribute { get; set; } = null!;
	public string RemoveAttribute { get; set; } = null!;

	public RemoveAuthAliasCommand(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret,
		string usernameOrAttribute, string removeattribute)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		UsernameOrAttribute = usernameOrAttribute.Trim().ToLower();
		RemoveAttribute = removeattribute.Trim().ToLower();
	}
}
