using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTermsAndConditions;

public sealed class GetTermsAndConditionsQueryHandler : IQueryHandler<GetTermsAndConditionsQuery, GetTermsAndConditionsResult>
{
	private readonly IServiceMindResidential _service;
	public GetTermsAndConditionsQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetTermsAndConditionsResult> Handle(GetTermsAndConditionsQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetTermsAndConditions(request);
	}
}

