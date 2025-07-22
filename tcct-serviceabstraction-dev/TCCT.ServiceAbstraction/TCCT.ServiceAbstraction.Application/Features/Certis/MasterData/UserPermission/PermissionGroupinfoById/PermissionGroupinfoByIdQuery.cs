using TCCT.ServiceAbstraction.Application.Configuration.Queries;


namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupinfoById;
public class PermissionGroupinfoByIdQuery : IQuery<List<PermissionGroupinfoByIdResult>>
{
	public string GroupId { get; set; }
	public PermissionGroupinfoByIdQuery(string groupid)
	{
		GroupId = groupid;
	}

}
