using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireHistory;

public sealed class GetQuestionnaireHistoryQueryHandler : IQueryHandler<GetQuestionnaireHistoryQuery, GetQuestionnaireHistoryResult>
{
	private readonly IServiceMindResidential _service;
	public GetQuestionnaireHistoryQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetQuestionnaireHistoryResult> Handle(GetQuestionnaireHistoryQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetQuestionnaireHistory(request);
	}

}

