using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetailByQRCode;

public class GetParkingDetailByQRCodeHandler : IQueryHandler<GetParkingDetailByQRCodeQuery, GetParkingDetailByQRCodeResult>
{
    private readonly IFinedayResidenceService _service;
    public GetParkingDetailByQRCodeHandler(IFinedayResidenceService service)
    {
        _service = service;
    }
    public async Task<GetParkingDetailByQRCodeResult> Handle(GetParkingDetailByQRCodeQuery request, CancellationToken cancellationToken)
    {
        return await _service.GetParkingDetailByQRCode(request.logCarparkID, request.lostCard);
    }
}
