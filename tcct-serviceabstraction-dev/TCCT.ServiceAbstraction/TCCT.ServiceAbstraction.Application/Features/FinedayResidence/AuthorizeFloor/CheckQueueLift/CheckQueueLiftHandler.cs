using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.CheckQueueLift;

public class CheckQueueLiftHandler : ICommandHandler<CheckQueueLiftCommand, CheckQueueLiftResult>
{
    private readonly IFinedayResidenceService _service;
    public CheckQueueLiftHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<CheckQueueLiftResult> Handle(CheckQueueLiftCommand request, CancellationToken cancellationToken)
	{
		return await _service.CheckQueueLift(request);
	}
}
