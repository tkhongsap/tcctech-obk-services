using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateStatusMember;

public class UpdateStatusMemberCommand : AuditableModel, IRequest<UpdateStatusMemberResult>
{
	public Guid MID { get; set; }
	public int Status { get; set; }
	public UpdateStatusMemberCommand(Guid mid, int status)
	{
		MID = mid;
		Status = status;
	}
}
