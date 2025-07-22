using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlocker;

public class PmsCarBlockerHandler : ICommandHandler<PmsCarBlockerCommand, PmsCarBlockerResult>
{
    private readonly IMTService _service;
    public PmsCarBlockerHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<PmsCarBlockerResult> Handle(PmsCarBlockerCommand request, CancellationToken cancellationToken)
	{
		return await _service.PmsCarBlocker(request);
	}
}
