using MediatR;
using TCCTOBK.OperationBackend.Application.Helper.Auditable;

namespace TCCTOBK.OperationBackend.Application.Features.CMS.MemberManagement.Command.UpdateMember;

public class UpdateMemberCommand : AuditableModel, IRequest<UpdateMemberResult>
{
	public Guid MID { get; set; }
	public string Name { get; set; } = null!;
	public int Status { get; set; }
	public string? KeycloakUser { get; set; }
	public bool IsActive { get; set; }
	public UpdateMemberCommand(Guid mid, string name, int status, string? keycloakuser, bool isactive)
	{
		MID = mid;
		Name = name;
		Status = status;
		KeycloakUser = keycloakuser;
		IsActive = isactive;
	}
}
