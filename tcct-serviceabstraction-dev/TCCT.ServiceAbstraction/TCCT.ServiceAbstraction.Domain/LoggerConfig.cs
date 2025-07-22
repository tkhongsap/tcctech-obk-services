namespace TCCT.ServiceAbstraction.Domain;
public class LoggerConfig
{
	public KeycloakConfig Keycloak { get; set; } = new();

	public void GetEnvironmentVariables()
	{
		Keycloak.Version = Environment.GetEnvironmentVariable("LOGGER_KC_VERSION")!;
		Keycloak.EndPoint = Environment.GetEnvironmentVariable("LOGGER_KC_ENDPOINT")!;
		Keycloak.Realms = Environment.GetEnvironmentVariable("LOGGER_KC_REALMS")!;
		Keycloak.RealmsAuthAttribute = Environment.GetEnvironmentVariable("LOGGER_KC_REALMSAUTHATTRIBUTE")!;
		Keycloak.ClientID = Environment.GetEnvironmentVariable("LOGGER_KC_CLIENTID")!;
		Keycloak.ClientSecret = Environment.GetEnvironmentVariable("LOGGER_KC_CLIENTSECRET")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("LOGGER_KC_VERSION", Keycloak.Version);
		Environment.SetEnvironmentVariable("LOGGER_KC_ENDPOINT", Keycloak.EndPoint);
		Environment.SetEnvironmentVariable("LOGGER_KC_REALMS", Keycloak.Realms);
		Environment.SetEnvironmentVariable("LOGGER_KC_REALMSAUTHATTRIBUTE", Keycloak.RealmsAuthAttribute);
		Environment.SetEnvironmentVariable("LOGGER_KC_CLIENTID", Keycloak.ClientID);
		Environment.SetEnvironmentVariable("LOGGER_KC_CLIENTSECRET", Keycloak.ClientSecret);
	}
}
