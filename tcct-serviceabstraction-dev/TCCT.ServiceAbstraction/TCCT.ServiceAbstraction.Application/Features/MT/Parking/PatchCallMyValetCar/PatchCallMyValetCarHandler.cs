using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PatchCallMyValetCar;

public class PatchCallMyValetCarHandler : ICommandHandler<PatchCallMyValetCarCommand, PatchCallMyValetCarResult>
{
    private readonly IMTService _service;
    public PatchCallMyValetCarHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<PatchCallMyValetCarResult> Handle(PatchCallMyValetCarCommand request, CancellationToken cancellationToken)
	{
		return await _service.PatchCallMyValetCar(request);
	}
}
