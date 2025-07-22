using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.CancelInvite;

public class CancelInviteResidenceVisitorHandler : ICommandHandler<CancelInviteResidenceVisitorCommand, CancelInviteResidenceVisitorResult>
{
    private readonly IFinedayResidenceService _service;
    public CancelInviteResidenceVisitorHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<CancelInviteResidenceVisitorResult> Handle(CancelInviteResidenceVisitorCommand request, CancellationToken cancellationToken)
	{
		return await _service.CancelInviteResidenceVisitor(request.inviteID, request.personID);
	}
}
