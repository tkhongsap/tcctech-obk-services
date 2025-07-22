namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;

public class AddAuthAliasRequest
{
	public string Username { get; set; } = null!;
	public string NewAttribute { get; set; } = null!;
}

