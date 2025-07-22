using TCCT.ServiceAbstraction.Application.Configuration.Queries;



namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupById;
public class PermissionGroupByIdQuery : IQuery<List<PermissionGroupByIdResult>>
{
	public string GroupId { get; set; }
	public PermissionGroupByIdQuery(string groupid)
	{
		GroupId = groupid;
	}
}
