using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetStatusCodes;

public sealed class GetStatusCodesQueryHandler : IQueryHandler<GetStatusCodesQuery, List<GetStatusCodesResult>>
{
	private readonly IServiceMindResidential _service;
	public GetStatusCodesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<List<GetStatusCodesResult>> Handle(GetStatusCodesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetStatusCodes(request);
	}

}

