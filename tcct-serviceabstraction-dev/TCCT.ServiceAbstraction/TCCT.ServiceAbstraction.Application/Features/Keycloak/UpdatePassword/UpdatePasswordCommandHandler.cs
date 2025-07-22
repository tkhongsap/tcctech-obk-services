using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.Keycloak;

namespace TCCT.ServiceAbstraction.Application.Features.Keycloak.UpdatePassword;
public class UpdatePasswordCommandHandler : ICommandHandler<UpdatePasswordCommand, UpdatePasswordResult>
{
	private readonly IKeycloakService _keycloakService;
	public UpdatePasswordCommandHandler(IKeycloakService keycloakService)
	{
		_keycloakService = keycloakService;
	}
	public async Task<UpdatePasswordResult> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
	{
		var realmadminservice = _keycloakService.WithRealm(request.Version, request.BaseUrl, request.Realm, request.AuthAttrName, request.ClientID, request.ClientSecret).WithRealmAdmin();
		var user = await realmadminservice.GetUserByUsernameOrAttribute(request.UsernameOrAttribute, true); // true = ป้องกันการเดา username, ถ้าหา user ไม่เจอให้ throw exception ว่า user หรือ password ไม่ถูกต้อง
		var res = await realmadminservice.UpdatePassword(user.Username, request.OldPassword, request.NewPassword);
		return res;
	}
}
