namespace TCCT.ServiceAbstraction.Application.Contracts.Keycloak;
public interface IKeycloakEndpointProvider
{
	string GetOpenIDTokenUrl();
	string GetResetPasswordUrl(Guid userid);
	string GetUserUrl(Guid userid);
	string GetUsersUrl(string? querystr = null);
	string GetEventsLog(string? querystr = null);
	void SetVersion(string version, string baseurl, string realm);
}
