using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetRegisteredVehicles;

public sealed class GetRegisteredVehiclesHandler : IQueryHandler<GetRegisteredVehiclesQuery, GetRegisteredVehiclesResult>
{
	private readonly IServiceMindResidential _service;
	public GetRegisteredVehiclesHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetRegisteredVehiclesResult> Handle(GetRegisteredVehiclesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetRegisteredVehicles(request);
	}

}

