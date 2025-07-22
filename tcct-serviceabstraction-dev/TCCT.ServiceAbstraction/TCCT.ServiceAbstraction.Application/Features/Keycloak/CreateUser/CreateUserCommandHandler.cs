using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.CreateUser;

public sealed class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, CreateUserResult>
{
	private readonly IKeycloakService _keycloakservice;
	public CreateUserCommandHandler(IKeycloakService keycloakservice)
	{
		_keycloakservice = keycloakservice;
	}

	public async Task<CreateUserResult> Handle(CreateUserCommand request, CancellationToken cancellationToken)
	{
		var forceAddEmail = false;
		if (request.Version == "16") forceAddEmail = true;

		return await _keycloakservice
			.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
			.WithRealmAdmin()
			.CreateUser(request.EmailOrPhone, request.Password, request.Firstname, request.Lastname, forceAddEmail);
	}

}

