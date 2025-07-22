using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetVisitorDetails;

public sealed class GetVisitorDetailsQueryHandler : IQueryHandler<GetVisitorDetailsQuery, GetVisitorDetailsResult>
{
	private readonly IServiceMindResidential _service;
	public GetVisitorDetailsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetVisitorDetailsResult> Handle(GetVisitorDetailsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetVisitorDetails(request);
	}

}

