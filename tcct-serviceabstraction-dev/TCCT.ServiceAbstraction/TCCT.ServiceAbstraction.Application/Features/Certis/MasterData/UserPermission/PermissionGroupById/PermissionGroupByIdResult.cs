namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupById;

public class PermissionGroupByIdResult
{
	public int PermissionGroupId { get; set; }
	public PermissionGroup PermissionGroup { get; set; } = new PermissionGroup();
	public string PermissionCode { get; set; } = null!;
	public int Flag { get; set; }
}
public class PermissionGroup
{
	public int Id { get; set; }
	public string Code { get; set; } = null!;
	public string Name { get; set; } = null!;
	public string Description { get; set; }
}
