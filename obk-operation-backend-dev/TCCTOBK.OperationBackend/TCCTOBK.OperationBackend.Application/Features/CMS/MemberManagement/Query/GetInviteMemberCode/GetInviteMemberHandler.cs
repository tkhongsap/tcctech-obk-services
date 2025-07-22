using TCCTOBK.OperationBackend.Application.Configuration.Queries;
using TCCTOBK.OperationBackend.Application.Contracts;

namespace TCCTOBK.OperationBackend.Application;

public class GetInviteMemberHandler : IQueryHandler<GetInviteMemberCodeQuery, bool>
{
	private IUnitOfWork _uow;
	public GetInviteMemberHandler(IUnitOfWork uow)
	{
		_uow = uow;
	}
	public async Task<bool> Handle(GetInviteMemberCodeQuery request, CancellationToken cancellationToken)
	{
		var inviteitem = await _uow.InviteMemberRepository.Get(request.MID, request.InviteCode);
		var isvalid = true;
		if (inviteitem == null)
		{
			isvalid = false;
		}
		return isvalid;
	}
}
