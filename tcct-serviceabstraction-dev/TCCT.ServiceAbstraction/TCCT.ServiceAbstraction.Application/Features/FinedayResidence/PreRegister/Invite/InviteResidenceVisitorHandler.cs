using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.Invite;

public class InviteResidenceVisitorHandler : ICommandHandler<InviteResidenceVisitorCommand, InviteResidenceVisitorResult>
{
    private readonly IFinedayResidenceService _service;
    public InviteResidenceVisitorHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<InviteResidenceVisitorResult> Handle(InviteResidenceVisitorCommand request, CancellationToken cancellationToken)
	{
		return await _service.InviteResidenceVisitor(request.guestInviteName, request.residenceID, request.locationID, request.personID, request.inviteSchedule);
	}
}
