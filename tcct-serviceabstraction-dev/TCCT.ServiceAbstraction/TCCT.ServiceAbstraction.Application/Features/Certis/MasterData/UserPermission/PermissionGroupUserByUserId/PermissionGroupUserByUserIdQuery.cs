using TCCT.ServiceAbstraction.Application.Configuration.Queries;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupUserByUserId;
public class PermissionGroupUserByUserIdQuery : IQuery<List<PermissionGroupUserByUserIdResult>>
{
	public string UserId { get; set; }
	public PermissionGroupUserByUserIdQuery(string userid)
	{
		UserId = userid;
	}
}
