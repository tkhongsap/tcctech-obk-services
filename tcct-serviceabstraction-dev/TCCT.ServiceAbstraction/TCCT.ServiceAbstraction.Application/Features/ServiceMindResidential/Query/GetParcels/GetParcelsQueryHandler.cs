using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcels;

public sealed class GetParcelsQueryHandler : IQueryHandler<GetParcelsQuery, GetParcelsResult>
{
	private readonly IServiceMindResidential _service;
	public GetParcelsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetParcelsResult> Handle(GetParcelsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetParcels(request);
	}

}

