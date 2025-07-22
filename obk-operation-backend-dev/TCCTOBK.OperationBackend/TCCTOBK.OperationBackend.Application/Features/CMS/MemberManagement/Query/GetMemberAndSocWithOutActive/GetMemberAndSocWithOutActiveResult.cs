namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Query.GetMemberAndSocWithOutActive;
public class GetMemberAndSocWithOutActiveResult
{
	public Guid MID { get; set; }
	public string Email { get; set; } = default!;
	public List<RolePrivilege> Roles { get; set; } = new();
	public DateTime? UpdatedDate { get; set; }
	public string? UpdatedByName { get; set; } = default!;
	public int Status { get; set; }
	public DateTime? CreatedDate { get; set; }
	public string? CreatedDateDisplay => CreatedDate?.ToString("dd MMMM yyyy");
	public string? Name { get; set; } = default!;

	public List<FunctionRoleLocations>? FunctionRoleLocation { get; set; } = default!;
	public string? KeyCloakUserId { get; set; } = default!;
	public bool IsLocked { get; set; }
	public bool IsActive { get; set; }
	public int? StaffId { get; set; }
}

public class RolePrivilege
{
	public Guid RID { get; set; }
	public string? RoleName { get; set; }
	public List<PrivilegeItemData> PrivilegeItems { get; set; } = new();
}

public class PrivilegeItemData
{
	public Guid PTID { get; set; }
	public required string Name { get; set; }
	public string? Code { get; set; }
}

public class FunctionRoleLocations
{
    public int LocationId { get; set; } = default!;
    public int FunctionRoleId { get; set; } = default!;
}


public class ClientMemberData
{
    public Guid CSMID { get; set; }
    public Guid CSID { get; set; }
    public int? StaffId { get; set; }
    public string? DataJson { get; set; }
}