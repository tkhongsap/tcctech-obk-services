using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetParcelStatusList;

public sealed class GetParcelStatusListQueryHandler : IQueryHandler<GetParcelStatusListQuery, GetParcelStatusListResult>
{
	private readonly IServiceMindResidential _service;
	public GetParcelStatusListQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetParcelStatusListResult> Handle(GetParcelStatusListQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetParcelStatusList(request);
		return res;
	}
}

