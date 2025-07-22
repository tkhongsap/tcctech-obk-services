namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;

public class RemoveAuthAliasRequest
{
	public string Username { get; set; } = null!;
	public string RemoveAttribute { get; set; } = null!;
}

