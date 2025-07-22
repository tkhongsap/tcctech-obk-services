using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.EntCarpark;

public class EntCarparkHandler : ICommandHandler<EntCarparkCommand, EntCarparkResult>
{
    private readonly IMTService _service;
    public EntCarparkHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<EntCarparkResult> Handle(EntCarparkCommand request, CancellationToken cancellationToken)
	{
		return await _service.EntCarpark(request);
	}
}
