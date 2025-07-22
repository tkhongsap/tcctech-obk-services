using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.GetUser;

public sealed class GetUserQueryHandler : IQueryHandler<GetUserQuery, GetUserResult>
{
	private readonly IKeycloakService _keycloakservice;
	public GetUserQueryHandler(IKeycloakService keycloakservice)
	{
		_keycloakservice = keycloakservice;
	}

	public async Task<GetUserResult> Handle(GetUserQuery request, CancellationToken cancellationToken)
	{
		var res = await _keycloakservice
			.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
			.WithRealmAdmin()
			.GetUserByUsernameOrAttribute(request.UsernameOrAttribute);

		return new GetUserResult
		{
			ID = res.ID,
			Username = res.Username,
			AuthAttributes = res.AuthAttributes,
			Firstname = res.Firstname,
			Lastname = res.Lastname
		};
	}

}

