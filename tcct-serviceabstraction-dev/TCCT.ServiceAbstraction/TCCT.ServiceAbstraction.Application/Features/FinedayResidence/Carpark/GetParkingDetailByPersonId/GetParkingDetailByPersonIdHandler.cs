using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByPersonId;

public class GetParkingDetailByPersonIdHandler : IQueryHandler<GetParkingDetailByPersonIdQuery, GetParkingDetailByPersonIdResult>
{
    private readonly IFinedayResidenceService _service;
    public GetParkingDetailByPersonIdHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetParkingDetailByPersonIdResult> Handle(GetParkingDetailByPersonIdQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetParkingDetailByPersonId(request.personID, request.lostCard);
    }
}
