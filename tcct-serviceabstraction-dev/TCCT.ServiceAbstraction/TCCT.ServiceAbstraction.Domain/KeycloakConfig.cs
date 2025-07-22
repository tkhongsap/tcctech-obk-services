namespace TCCT.ServiceAbstraction.Domain;
public class KeycloakConfig
{
	public string Version { get; set; } = null!;
	public string EndPoint { get; set; } = null!;
	public string Realms { get; set; } = null!;
	public string RealmsAuthAttribute { get; set; } = null!;
	public string ClientID { get; set; } = null!;
	public string ClientSecret { get; set; } = null!;
}
