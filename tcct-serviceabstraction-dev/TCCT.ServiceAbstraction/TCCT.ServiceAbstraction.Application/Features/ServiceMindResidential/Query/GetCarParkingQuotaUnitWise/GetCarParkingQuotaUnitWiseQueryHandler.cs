using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuotaUnitWise;

public sealed class GetCarParkingQuotaUnitWiseHandler : IQueryHandler<GetCarParkingQuotaUnitWiseQuery, GetCarParkingQuotaUnitWiseResult>
{
	private readonly IServiceMindResidential _service;
	public GetCarParkingQuotaUnitWiseHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetCarParkingQuotaUnitWiseResult> Handle(GetCarParkingQuotaUnitWiseQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetCarParkingQuotaUnitWise(request);
	}

}

