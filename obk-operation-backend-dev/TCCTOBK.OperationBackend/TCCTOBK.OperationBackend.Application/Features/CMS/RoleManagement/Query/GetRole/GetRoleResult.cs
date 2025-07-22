using System.Text.Json.Serialization;
using TCCTOBK.OperationBackend.Domain.Entities;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetRole;

public class GetRoleResult
{
	public string RID { get; set; } = default!;
	public string RoleId { get; set; } = default!;
	public string RoleName { get; set; } = default!;
	public List<Privileges> PrivilegeItems => trRolePrivilagesItem.Select(x => new Privileges()
	{
		PTID = x.mtPrivilegeItem.PTID,
		PID = x.mtPrivilegeItem.PID,
		Name = x.mtPrivilegeItem.Name
	}).ToList();

	[JsonIgnore]
	public List<trRolePrivilegeItem> trRolePrivilagesItem = new();

	public int Status { get; set; }
	public Guid CreatedBy { get; set; }
	public string CreatedByName { get; set; } = default!;
	public DateTime CreatedAt { get; set; }
	public Guid UpdatedBy { get; set; }
	public string UpdatedByName { get; set; } = default!;
	public DateTime UpdatedAt { get; set; }
}

public class Privileges
{
	public Guid PTID { get; set; }
	public Guid PID { get; set; }
	public string Name { get; set; } = default!;
}


