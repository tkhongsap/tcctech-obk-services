using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetCommonAreas;

public sealed class GetCommonAreasQueryHandler : IQueryHandler<GetCommonAreasQuery, GetCommonAreasResult>
{
	private readonly IServiceMindResidential _service;
	public GetCommonAreasQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetCommonAreasResult> Handle(GetCommonAreasQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetCommonAreas(request);
	}

}

