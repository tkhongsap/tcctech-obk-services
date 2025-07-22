using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.AddAuthAlias;

public sealed class AddAuthAliasCommandHandler : ICommandHandler<AddAuthAliasCommand, AddAuthAliasResult>
{
	private readonly IKeycloakService _keycloakService;
	public AddAuthAliasCommandHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}

	public async Task<AddAuthAliasResult> Handle(AddAuthAliasCommand request, CancellationToken cancellationToken)
	{
		return await _keycloakService
			.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
			.WithRealmAdmin()
			.AddAuthAlias(request.UsernameOrAttribute, request.NewAttribute);
	}

}

