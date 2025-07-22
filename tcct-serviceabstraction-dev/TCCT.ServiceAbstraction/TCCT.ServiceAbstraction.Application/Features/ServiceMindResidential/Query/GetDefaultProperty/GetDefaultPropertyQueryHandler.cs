using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetDefaultProperty;

public sealed class GetDefaultPropertyQueryHandler : IQueryHandler<GetDefaultPropertyQuery, GetDefaultPropertyResult>
{
	private readonly IServiceMindResidential _service;
	public GetDefaultPropertyQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetDefaultPropertyResult> Handle(GetDefaultPropertyQuery request, CancellationToken cancellationToken)
	{
		var res = await _service.GetDefaultProperty(request);
		return res;
	}
}

