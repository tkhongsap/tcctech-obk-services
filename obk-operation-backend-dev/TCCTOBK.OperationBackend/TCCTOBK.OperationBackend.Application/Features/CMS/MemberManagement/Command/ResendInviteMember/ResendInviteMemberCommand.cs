using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.ResendInviteMember;

public class ResendInviteMemberCommand : AuditableModel, IRequest<ResendInviteMemberResult>
{
	public Guid MID { get; set; }
	public ResendInviteMemberCommand(Guid mid)
	{
		MID = mid;
	}
}
