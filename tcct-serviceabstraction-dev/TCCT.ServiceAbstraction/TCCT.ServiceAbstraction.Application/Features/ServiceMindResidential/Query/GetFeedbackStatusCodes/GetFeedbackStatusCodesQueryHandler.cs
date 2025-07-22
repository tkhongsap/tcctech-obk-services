using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetFeedbackStatusCodes;

public sealed class GetFeedbackStatusCodesQueryHandler : IQueryHandler<GetFeedbackStatusCodesQuery, List<GetFeedbackStatusCodesResult>>
{
	private readonly IServiceMindResidential _service;
	public GetFeedbackStatusCodesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<List<GetFeedbackStatusCodesResult>> Handle(GetFeedbackStatusCodesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetFeedbackStatusCodes(request);
	}

}

