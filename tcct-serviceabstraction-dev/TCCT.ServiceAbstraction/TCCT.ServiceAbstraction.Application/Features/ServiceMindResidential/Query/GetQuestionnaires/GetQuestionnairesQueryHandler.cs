using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaires;

public sealed class GetQuestionnairesQueryHandler : IQueryHandler<GetQuestionnairesQuery, GetQuestionnairesResult>
{
	private readonly IServiceMindResidential _service;
	public GetQuestionnairesQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetQuestionnairesResult> Handle(GetQuestionnairesQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetQuestionnaires(request);
	}

}

