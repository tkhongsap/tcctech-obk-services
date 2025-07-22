using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.GetQueueCallLift;

public class GetQueueCallLiftHandler : ICommandHandler<GetQueueCallLiftCommand, GetQueueCallLiftResult>
{
    private readonly IFinedayResidenceService _service;
    public GetQueueCallLiftHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetQueueCallLiftResult> Handle(GetQueueCallLiftCommand request, CancellationToken cancellationToken)
	{
		return await _service.GetQueueCallLift(request);
	}
}
