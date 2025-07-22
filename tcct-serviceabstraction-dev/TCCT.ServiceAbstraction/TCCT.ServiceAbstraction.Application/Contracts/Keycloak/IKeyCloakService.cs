namespace TCCT.ServiceAbstraction.Application.Contracts.Keycloak
{
	public interface IKeycloakService
	{
		IKeycloakRealmService WithRealm(string version, string baseurl, string realm, string authattrname, string clientid, string cliendsecret);
	}
}
