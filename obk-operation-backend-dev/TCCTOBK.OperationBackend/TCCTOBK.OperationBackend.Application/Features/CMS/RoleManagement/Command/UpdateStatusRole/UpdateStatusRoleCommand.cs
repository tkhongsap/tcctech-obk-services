using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.RoleManagement.Command.UpdateStatusRole;

public class UpdateStatusRoleCommand : AuditableModel, ICommand<UpdateStatusRoleResult>
{
	public Guid Id { get; set; }
	public bool IsActive { get; set; }
	public UpdateStatusRoleCommand(Guid id, bool isActive)
	{
		Id = id;
		IsActive = isActive;
	}

}
