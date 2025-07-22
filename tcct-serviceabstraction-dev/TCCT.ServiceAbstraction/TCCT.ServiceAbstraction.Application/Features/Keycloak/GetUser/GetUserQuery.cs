using TCCT.ServiceAbstraction.Application.Configuration.Queries;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;
public class GetUserQuery : IQuery<GetUserResult>
{
	public string Version { get; set; } = null!;
	public string BaseUrl { get; set; } = null!;
	public string Realm { get; set; } = null!;
	public string AuthAttrName { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;

	public string UsernameOrAttribute { get; set; }

	public GetUserQuery(string version, string baseUrl, string realm, string authAttrName, string clientId, string clientSecret, string usernameorattribute)
	{
		Version = version;
		BaseUrl = baseUrl;
		Realm = realm;
		AuthAttrName = authAttrName;
		ClientID = clientId;
		ClientSecret = clientSecret;

		UsernameOrAttribute = usernameorattribute.Trim().ToLower();
	}
}
