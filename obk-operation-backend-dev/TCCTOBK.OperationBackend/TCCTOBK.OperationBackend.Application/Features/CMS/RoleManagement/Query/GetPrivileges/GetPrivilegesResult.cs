namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;

public class GetPrivilegesResult
{
	public Guid PID { get; set; }
	public string Name { get; set; } = default!;
	public List<PrivilegeItem> PrivilegeItems { get; set; } = default!;
}

public class PrivilegeItem
{
	public Guid PID { get; set; }
	public Guid PTID { get; set; }
	public string Name { get; set; } = default!;
	public string? Code { get; set; }
	public string? Description { get; set; }
	public bool IsActive { get; set; }
}
