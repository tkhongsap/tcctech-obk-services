using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorList;

public sealed class GetVisitorListQueryHandler : IQueryHandler<GetVisitorListQuery, GetVisitorListResult>
{
	private readonly IServiceMindResidential _service;
	public GetVisitorListQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetVisitorListResult> Handle(GetVisitorListQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetVisitorList(request);
	}

}

