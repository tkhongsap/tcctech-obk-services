namespace TCCT.ServiceAbstraction.Application.Features.Certis.MasterData.UserPermission.PermissionGroupUserByUserId;

public class PermissionGroupUserByUserIdResult
{
	public string Id { get; set; } = null!;
	public string PermissionGroupId { get; set; } = null!;
	public PermissionGroups PermissionGroup { get; set; } = null!;
	public string UserId { get; set; } = null!;
}
public class PermissionGroups
{
	public string Id { get; set; } = null!;
	public string Code { get; set; } = null!;
	public string Name { get; set; } = null!;
	public bool sys { get; set; }
}