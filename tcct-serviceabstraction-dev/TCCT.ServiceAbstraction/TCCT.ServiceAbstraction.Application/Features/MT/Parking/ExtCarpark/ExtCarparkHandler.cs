using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.ExtCarpark;

public class ExtCarparkHandler : ICommandHandler<ExtCarparkCommand, ExtCarparkResult>
{
    private readonly IMTService _service;
    public ExtCarparkHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<ExtCarparkResult> Handle(ExtCarparkCommand request, CancellationToken cancellationToken)
	{
		return await _service.ExtCarpark(request);
	}
}
