using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Model;
public class RoleModel
{
	public Guid RID { get; set; }
	public required string Name { get; set; }
	public string? Description { get; set; }
	public List<PrivilegeItem> PrivilegeItems { get; set; } = new();
	public string? UpdatedDate { get; set; }
	public string? UpdatedByName { get; set; }
	public int IsActive { get; set; } = default!;
}
