using TCCT.ServiceAbstraction.Application.Configuration.Queries;
using TCCT.ServiceAbstraction.Application.Contracts.ServiceMindResidential;

namespace TCCT.ServiceAbstraction.Application.Features.ServiceMindResidential.Query.GetTenantDetailsParcel;

public sealed class GetTenantDetailsParcelQueryHandler : IQueryHandler<GetTenantDetailsParcelQuery, GetTenantDetailsParcelResult>
{
	private readonly IServiceMindResidential _service;
	public GetTenantDetailsParcelQueryHandler(IServiceMindResidential service)
	{
		_service = service;
	}

	public async Task<GetTenantDetailsParcelResult> Handle(GetTenantDetailsParcelQuery request, CancellationToken cancellationToken)
	{
		return await _service.GetTenantDetailsParcel(request);
	}

}

