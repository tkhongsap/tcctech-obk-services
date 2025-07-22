using MediatR;
using TCCTOBK.OperationBackend.Application.Configuration.Commands;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.InviteMember;

public class InviteMemberCommand : AuditableModel, ICommand<InviteMemberResult>
{
	public string Email { get; set; }
	public List<Guid> Roles { get; set; } = new List<Guid>();
	public InviteMemberCommand(string email, List<Guid> roles)
	{
		Email = email;
		Roles = roles;
	}
}
