using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.RefreshToken;

public class RefreshTokenHandler : ICommandHandler<RefreshTokenCommand, RefreshTokenResult>
{
	private readonly IKeycloakService _keycloakService;
	public RefreshTokenHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}

	public async Task<RefreshTokenResult> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
	{
		var realmservice = _keycloakService.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret);
		var res = await realmservice.RefreshToken(request.RefreshToken);
		return new RefreshTokenResult()
		{
			access_token = res.access_token,
			refresh_token = res.refresh_token,
			expires_in = res.expires_in
		};
	}
}
