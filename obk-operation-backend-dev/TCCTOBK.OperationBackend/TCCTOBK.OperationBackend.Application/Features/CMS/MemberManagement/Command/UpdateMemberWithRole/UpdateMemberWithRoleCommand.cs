using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application;

public class UpdateMemberWithRoleCommand : AuditableModel, IRequest<UpdateMemberWithRoleResult>
{
	public Guid MID { get; set; }
	public int Status { get; set; } = default!;
	public List<Guid> RoleItem { get; set; } = new List<Guid>();
}
