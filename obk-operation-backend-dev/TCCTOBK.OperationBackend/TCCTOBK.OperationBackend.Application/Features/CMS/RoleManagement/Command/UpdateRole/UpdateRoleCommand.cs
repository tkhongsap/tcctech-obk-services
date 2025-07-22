using MediatR;
using TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Query.GetPrivileges;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateRole;

public class UpdateRoleCommand : AuditableModel, IRequest<UpdateRoleResult>
{
	public Guid Rid { get; set; }
	public int Status { get; set; }
	public string RoleName { get; set; } = default!;
	public string? Description { get; set; }
	public List<PrivilegeItem> PrivilegeItems { get; set; } = default!;

}
