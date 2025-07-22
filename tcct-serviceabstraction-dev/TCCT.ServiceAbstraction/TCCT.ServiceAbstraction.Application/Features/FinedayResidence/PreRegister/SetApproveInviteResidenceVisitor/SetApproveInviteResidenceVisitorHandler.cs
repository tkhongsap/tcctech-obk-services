using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.PreRegister.SetApproveInviteResidenceVisitor;

public class SetApproveInviteResidenceVisitorHandler : ICommandHandler<SetApproveInviteResidenceVisitorCommand, SetApproveInviteResidenceVisitorResult>
{
    private readonly IFinedayResidenceService _service;
    public SetApproveInviteResidenceVisitorHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<SetApproveInviteResidenceVisitorResult> Handle(SetApproveInviteResidenceVisitorCommand request, CancellationToken cancellationToken)
	{
		return await _service.SetApproveInviteResidenceVisitor(request);
	}
}
