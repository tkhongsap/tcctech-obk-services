using System;
using TCCT.ServiceAbstraction.Application.Configuration.Commands;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.AuthorizeFloor.ChangeDefaultFloor;

public class ChangeDefaultFloorHandler : ICommandHandler<ChangeDefaultFloorCommand, ChangeDefaultFloorResult>
{
    private readonly IFinedayResidenceService _service;
    public ChangeDefaultFloorHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<ChangeDefaultFloorResult> Handle(ChangeDefaultFloorCommand request, CancellationToken cancellationToken)
	{
		var res = await _service.ChangeDefaultFloor(request.floorID, request.zoneID, request.personID);
        return res;
	}
}
