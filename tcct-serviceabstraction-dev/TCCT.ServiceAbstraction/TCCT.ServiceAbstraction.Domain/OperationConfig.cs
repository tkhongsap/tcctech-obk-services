namespace TCCT.ServiceAbstraction.Domain;
public class OperationConfig
{
	public KeycloakConfig Keycloak { get; set; } = new();

	public void GetEnvironmentVariables()
	{
		Keycloak.Version = Environment.GetEnvironmentVariable("OPERATION_KC_VERSION")!;
		Keycloak.EndPoint = Environment.GetEnvironmentVariable("OPERATION_KC_ENDPOINT")!;
		Keycloak.Realms = Environment.GetEnvironmentVariable("OPERATION_KC_REALMS")!;
		Keycloak.RealmsAuthAttribute = Environment.GetEnvironmentVariable("OPERATION_KC_REALMSAUTHATTRIBUTE")!;
		Keycloak.ClientID = Environment.GetEnvironmentVariable("OPERATION_KC_CLIENTID")!;
		Keycloak.ClientSecret = Environment.GetEnvironmentVariable("OPERATION_KC_CLIENTSECRET")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("OPERATION_KC_VERSION", Keycloak.Version);
		Environment.SetEnvironmentVariable("OPERATION_KC_ENDPOINT", Keycloak.EndPoint);
		Environment.SetEnvironmentVariable("OPERATION_KC_REALMS", Keycloak.Realms);
		Environment.SetEnvironmentVariable("OPERATION_KC_REALMSAUTHATTRIBUTE", Keycloak.RealmsAuthAttribute);
		Environment.SetEnvironmentVariable("OPERATION_KC_CLIENTID", Keycloak.ClientID);
		Environment.SetEnvironmentVariable("OPERATION_KC_CLIENTSECRET", Keycloak.ClientSecret);
	}
}
