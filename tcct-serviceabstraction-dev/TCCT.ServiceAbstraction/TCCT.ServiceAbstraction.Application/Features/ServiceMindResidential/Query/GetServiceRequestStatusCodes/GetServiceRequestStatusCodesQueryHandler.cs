using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetServiceRequestStatusCodes;

public sealed class GetServiceRequestStatusCodesQueryHandler : IQueryHandler<GetServiceRequestStatusCodesQuery, List<GetServiceRequestStatusCodesResult>>
{
	private readonly IServiceMindResidential _service;
	public GetServiceRequestStatusCodesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<List<GetServiceRequestStatusCodesResult>> Handle(GetServiceRequestStatusCodesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetServiceRequestStatusCodes(request);
	}

}

