using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.MT;

namespace TCCT.ServiceAbstraction.Application.Features.MT.Parking.PmsCarBlockerList;

public class PmsCarBlockerListHandler : ICommandHandler<PmsCarBlockerListCommand, List<PmsCarBlockerListResult>>
{
    private readonly IMTService _service;
    public PmsCarBlockerListHandler(IMTService service)
    {
        _service = service;
    }

	public async Task<List<PmsCarBlockerListResult>> Handle(PmsCarBlockerListCommand request, CancellationToken cancellationToken)
	{
		return await _service.PmsCarBlockerList(request);
	}
}
