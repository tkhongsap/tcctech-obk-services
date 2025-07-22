using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.ResetPassword;
public class ResetPasswordCommandHandler : ICommandHandler<ResetPasswordCommand, ResetPasswordResult>
{
	private readonly IKeycloakService _keycloakService;
	public ResetPasswordCommandHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}
	public async Task<ResetPasswordResult> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
	{
		return await _keycloakService
			.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret)
			.WithRealmAdmin()
			.ResetPassword(request.UsernameOrAttribute, request.NewPassword);
	}
}
