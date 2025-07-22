using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Infrastructure.Keycloak;
public class KeycloakEndpointProvider : IKeycloakEndpointProvider
{
	private string _version = "";
	private string _baseurl = "";
	private string _realm = "";

	public void SetVersion(string version, string baseurl, string realm)
	{
		_version = version;
		_baseurl = baseurl;
		_realm = realm;
	}

	private string GetVersionPrefix()
	{
		return _version == "16" ? "/auth" : "";
	}

	public string GetOpenIDTokenUrl()
	{
		return $"{_baseurl}{GetVersionPrefix()}/realms/{_realm}/protocol/openid-connect/token";
	}

	public string GetUserUrl(Guid userid)
	{
		return $"{_baseurl}{GetVersionPrefix()}/admin/realms/{_realm}/users/{userid}";
	}

	public string GetUsersUrl(string? querystr = null)
	{
		return $"{_baseurl}{GetVersionPrefix()}/admin/realms/{_realm}/users" + (string.IsNullOrEmpty(querystr) ? "" : $"?{querystr}");
	}

	public string GetResetPasswordUrl(Guid userid)
	{
		return $"{_baseurl}{GetVersionPrefix()}/admin/realms/{_realm}/users/{userid}/reset-password";
	}

	public string GetEventsLog(string? querystr = null)
	{
		return $"{_baseurl}{GetVersionPrefix()}/admin/realms/{_realm}/events" + (string.IsNullOrEmpty(querystr) ? "" : $"?{querystr}");
	}
}
