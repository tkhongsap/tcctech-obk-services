using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.Login;

public sealed class LoginCommandHandler : ICommandHandler<LoginCommand, LoginResult>
{
	private readonly IKeycloakService _keycloakService;
	public LoginCommandHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}

	public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		var realmservice = _keycloakService.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret);
		var user = await realmservice.WithRealmAdmin().GetUserByUsernameOrAttribute(request.Username, true); // true = ป้องกันการเดา username, ถ้าหา user ไม่เจอให้ throw exception ว่า user หรือ password ไม่ถูกต้อง
		var res = await realmservice.Login(user.Username, request.Password);
		return new LoginResult()
		{
			access_token = res.access_token,
			refresh_token = res.refresh_token,
			expires_in = res.expires_in
		};
	}

}

