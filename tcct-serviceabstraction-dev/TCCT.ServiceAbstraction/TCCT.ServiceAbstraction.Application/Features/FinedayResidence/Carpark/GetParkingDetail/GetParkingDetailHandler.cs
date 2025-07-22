using System;
using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.FinedayResidence;

namespace TCCT.ServiceAbstraction.Application.Features.FinedayResidence.Carpark.GetParkingDetail;

public class GetParkingDetailHandler : IQueryHandler<GetParkingDetailQuery, GetParkingDetailResult>
{
    private readonly IFinedayResidenceService _service;
    public GetParkingDetailHandler(IFinedayResidenceService service)
    {
        _service = service;
    }

	public async Task<GetParkingDetailResult> Handle(GetParkingDetailQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetParkingDetail(request.search, request.lostCard);
	}
}
