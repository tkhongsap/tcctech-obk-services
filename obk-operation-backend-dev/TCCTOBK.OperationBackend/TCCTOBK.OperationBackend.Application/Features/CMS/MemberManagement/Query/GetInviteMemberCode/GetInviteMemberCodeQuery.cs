using TCCTOBK.OperationBackend.Application.Configuration.Queries;

namespace TCCTOBK.OperationBackend.Application;

public class GetInviteMemberCodeQuery : IQuery<bool>
{
	public string InviteCode { get; set; } = default!;
	public Guid MID { get; set; } = default!;
	public GetInviteMemberCodeQuery(string invitecode, Guid mid)
	{
		InviteCode = invitecode;
		MID = mid;
	}
}
