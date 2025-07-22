using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCarParkingQuota;

public sealed class GetCarParkingQuotaHandler : IQueryHandler<GetCarParkingQuotaQuery, GetCarParkingQuotaResult>
{
	private readonly IServiceMindResidential _service;
	public GetCarParkingQuotaHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetCarParkingQuotaResult> Handle(GetCarParkingQuotaQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetCarParkingQuota(request);
	}

}

