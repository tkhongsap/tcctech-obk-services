

using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.RemoveRole;

public class RemoveRoleCommand : AuditableModel, ICommand<int>
{
	public Guid RoleId { get; set; }
	public RemoveRoleCommand(string roleId)
	{
		RoleId = Guid.Parse(roleId);
	}
}