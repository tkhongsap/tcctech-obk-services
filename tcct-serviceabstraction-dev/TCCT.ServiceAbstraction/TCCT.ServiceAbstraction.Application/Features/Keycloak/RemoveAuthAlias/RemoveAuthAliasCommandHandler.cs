using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RemoveAuthAlias;

public sealed class RemoveAuthAliasCommandHandler : ICommandHandler<RemoveAuthAliasCommand, RemoveAuthAliasResult>
{
	private readonly IKeycloakService _keycloakService;
	public RemoveAuthAliasCommandHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}

	public async Task<RemoveAuthAliasResult> Handle(RemoveAuthAliasCommand request, CancellationToken cancellationToken)
	{
		var cannotRemoveEmail = false;
		if (request.Version == "16") cannotRemoveEmail = true;
		return await _keycloakService
			.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
			.WithRealmAdmin()
			.RemoveAuthAlias(request.UsernameOrAttribute, request.RemoveAttribute, cannotRemoveEmail);
	}

}

