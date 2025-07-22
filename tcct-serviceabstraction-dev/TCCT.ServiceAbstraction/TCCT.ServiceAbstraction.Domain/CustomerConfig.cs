namespace TCCT.ServiceAbstraction.Domain;
public class CustomerConfig
{
	public KeycloakConfig Keycloak { get; set; } = new();

	public void GetEnvironmentVariables()
	{
		Keycloak.Version = Environment.GetEnvironmentVariable("CUSTOMER_KC_VERSION")!;
		Keycloak.EndPoint = Environment.GetEnvironmentVariable("CUSTOMER_KC_ENDPOINT")!;
		Keycloak.Realms = Environment.GetEnvironmentVariable("CUSTOMER_KC_REALMS")!;
		Keycloak.RealmsAuthAttribute = Environment.GetEnvironmentVariable("CUSTOMER_KC_REALMSAUTHATTRIBUTE")!;
		Keycloak.ClientID = Environment.GetEnvironmentVariable("CUSTOMER_KC_CLIENTID")!;
		Keycloak.ClientSecret = Environment.GetEnvironmentVariable("CUSTOMER_KC_CLIENTSECRET")!;
	}

	public void SetEnvironmentVariables()
	{
		Environment.SetEnvironmentVariable("CUSTOMER_KC_VERSION", Keycloak.Version);
		Environment.SetEnvironmentVariable("CUSTOMER_KC_ENDPOINT", Keycloak.EndPoint);
		Environment.SetEnvironmentVariable("CUSTOMER_KC_REALMS", Keycloak.Realms);
		Environment.SetEnvironmentVariable("CUSTOMER_KC_REALMSAUTHATTRIBUTE", Keycloak.RealmsAuthAttribute);
		Environment.SetEnvironmentVariable("CUSTOMER_KC_CLIENTID", Keycloak.ClientID);
		Environment.SetEnvironmentVariable("CUSTOMER_KC_CLIENTSECRET", Keycloak.ClientSecret);
	}
}
