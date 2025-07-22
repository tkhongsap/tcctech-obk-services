using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;
using TCCT.ServiceAbstraction.Application.Features.ServiceMindResidentialResponse;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetQuestionnaireDetail;

public sealed class GetQuestionnaireDetailQueryHandler : IQueryHandler<GetQuestionnaireDetailQuery, GetQuestionnaireDetailResult>
{
	private readonly IServiceMindResidential _service;
	public GetQuestionnaireDetailQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetQuestionnaireDetailResult> Handle(GetQuestionnaireDetailQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetQuestionnaireDetails(request);
	}

}

